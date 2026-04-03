import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Service } from "typedi";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "@/configs/env";
import { IUser } from "@/interfaces/users.interface";
import { UserModel } from "@/models/user.model";
import { HttpException } from "@/exceptions/httpException";

const generateAccessToken = (user: IUser) => {
  return jwt.sign(
    {
      id: user.id,
      user_name: user.user_name,
      email: user.email,
    },
    ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" },
  );
};

const generateRefreshToken = (user: IUser) => {
  return jwt.sign(
    {
      id: user.id,
      user_name: user.user_name,
      email: user.email,
    },
    REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" },
  );
};
@Service()
export class AuthService {
  // [POST]/register
  public async registerService(userData: IUser) {
    const {
      user_name,
      email,
      password,
      confirm_password,
      full_name,
      date_of_birth,
      avatar_image_url,
    } = userData;

    if (password !== confirm_password) {
      throw new HttpException(400, "Passwords do not match");
    }

    const userAvailable = await UserModel.findOne({
      where: { user_name },
    });

    if (userAvailable) {
      throw new HttpException(409, `Username ${user_name} already exists`);
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({
      user_name,
      email,
      password: hashPassword,
      confirm_password: hashPassword,
      full_name,
      date_of_birth,
      avatar_image_url,
      reset_password_token: null,
      reset_password_expires: null,
    });

    return newUser;
  }

  // [POST]/Login
  public async loginService(userData: IUser) {
    const { user_name, password } = userData;
    if (!user_name || !password) {
      throw new HttpException(400, "All fields are mandatory!");
    }
    const userAvailable = await UserModel.findOne({
      where: { user_name },
      raw: true,
    });
    if (!userAvailable) throw new HttpException(409, `This email ${user_name} was not found`);
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
      const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as IUser;
      const newAccessToken = generateAccessToken(decoded);
      return { newAccessToken };
    } catch (error) {
      console.error(error);
      throw new HttpException(403, "Invalid or expired refresh token");
    }
  }

  //[POST]/Change password
  public async changePasswordService(userId: number, oldPassword: string, newPassword: string) {
    const user = await UserModel.findByPk(userId);
    if (!user) {
      throw new HttpException(404, "User not found");
    }

    const isOldPasswordMatching = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordMatching) {
      throw new HttpException(400, "Old password is incorrect");
    }

    const hashNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashNewPassword;
    user.confirm_password = hashNewPassword;
    await user.save();
  }
}
