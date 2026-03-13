import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Service } from "typedi";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "@/configs/env";
import { User } from "@/interfaces/users.interface";
import { UserModel } from "@/models/user.model";
import { HttpException } from "@/exceptions/httpException";

const generateAccessToken = (user: User) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" },
  );
};

const generateRefreshToken = (user: User) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" },
  );
};
@Service()
export class AuthService {
  // [POST]/register
  public async registerService(userData: User) {
    const { username, email, password, confirmPassword, fullName, dateOfBirth, avatarImageUrl } =
      userData;

    if (
      !username ||
      !email ||
      !password ||
      !confirmPassword ||
      !fullName ||
      !dateOfBirth ||
      !avatarImageUrl
    ) {
      throw new HttpException(400, "All fields are mandatory!");
    }

    if (password !== confirmPassword) {
      throw new HttpException(400, "Passwords do not match");
    }

    const userAvailable = await UserModel.findOne({
      where: { username },
    });

    if (userAvailable) {
      throw new HttpException(409, `Username ${username} already exists`);
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({
      username,
      email,
      password: hashPassword,
      fullName,
      dateOfBirth,
      avatarImageUrl,
    });

    return newUser;
  }

  // [POST]/Login
  public async loginService(userData: User) {
    const { username, password } = userData;
    if (!username || !password) {
      throw new HttpException(400, "All fields are mandatory!");
    }
    const userAvailable = await UserModel.findOne({
      where: { username },
      raw: true,
    });
    if (!userAvailable) throw new HttpException(409, `This email ${username} was not found`);
    const isPasswordMatching = await bcrypt.compare(password, userAvailable.password);
    if (!isPasswordMatching) {
      throw new HttpException(409, "You're password not matching");
    }
    const accessToken = generateAccessToken(userAvailable);
    const refreshToken = generateRefreshToken(userAvailable);
    return { userAvailable, accessToken, refreshToken };
  }

  //[POST]/Refresh token
  public refreshTokenService(refreshToken: string) {
    if (!refreshToken) {
      throw new HttpException(401, "No refresh token provided");
    }

    try {
      const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as User;
      const newAccessToken = generateAccessToken(decoded);
      return { newAccessToken };
    } catch (error) {
      console.error(error);
      throw new HttpException(403, "Invalid or expired refresh token");
    }
  }
}
