import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Service } from "typedi";
import { transporter } from "@/configs/mail";
import { UserModel } from "@/models/user.model";
import { HttpException } from "@/exceptions/httpException";
import { IUser, IRegisterUser } from "@/interfaces/users.interface";
import { generateRandomToken } from "@/utils/crypto";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, CLIENT_URL } from "@/configs/env";

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
  public async registerService(userData: IRegisterUser) {
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
    await user.save();
  }

  //[POST]/Forgot password
  async forgotPasswordService(email: string) {
    const user = await UserModel.findOne({ where: { email } });
    if (!user) {
      throw new HttpException(404, "User not found");
    }
    const token = generateRandomToken();
    user.reset_password_token = token;
    user.reset_password_expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    await user.save();
    const resetLink = `${CLIENT_URL}/reset-password?token=${token}`;
    await transporter.sendMail({
      to: email,
      subject: "Reset Password",
      html: `
        <h3>Reset Password</h3>
        <p>Click vào link dưới:</p>
        <a href="${resetLink}">${resetLink}</a>
      `,
    });

    return true;
  }

  //[POST]/Reset password
  async resetPasswordService(token: string, newPassword: string) {
    const user = await UserModel.findOne({
      where: { reset_password_token: token },
    });
    if (!user) {
      throw new HttpException(404, "Invalid or expired reset token");
    }

    if (!user.reset_password_expires || user.reset_password_expires < new Date()) {
      throw new HttpException(404, "Token expired");
    }

    const hashNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashNewPassword;
    user.reset_password_token = null;
    user.reset_password_expires = null;
    await user.save();

    return true;
  }
}
