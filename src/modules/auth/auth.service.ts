import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Service } from "typedi";
import { transporter } from "@/configs/mail";
import { HttpException } from "@/shared/exceptions/httpException";
import { IUser, IRegisterUser, ITokenPayload } from "@/shared/interfaces/users.interface";
import { generateRandomToken } from "@/shared/utils/crypto";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, CLIENT_URL } from "@/configs/env";
import { UserRepository } from "@/modules/user/user.repository";

const generateAccessToken = (user: ITokenPayload) => {
  return jwt.sign(
    { id: user.id, user_name: user.user_name, email: user.email },
    ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" },
  );
};

const generateRefreshToken = (user: ITokenPayload) => {
  return jwt.sign(
    { id: user.id, user_name: user.user_name, email: user.email },
    REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" },
  );
};

@Service()
export class AuthService {
  constructor(private userRepo: UserRepository) {}

  async registerService(userData: IRegisterUser) {
    const { user_name, email, password, confirm_password, full_name, date_of_birth, avatar_image_url } = userData;

    if (password !== confirm_password) {
      throw new HttpException(400, "Passwords do not match");
    }

    const existingUser = await this.userRepo.findByUserName(user_name);
    if (existingUser) {
      throw new HttpException(409, `Username ${user_name} already exists`);
    }

    const existingEmail = await this.userRepo.findByEmail(email);
    if (existingEmail) {
      throw new HttpException(409, `Email ${email} already registered`);
    }

    const hashPassword = await bcrypt.hash(password, 10);
    return this.userRepo.create({
      user_name,
      email,
      password: hashPassword,
      full_name,
      date_of_birth,
      avatar_image_url,
      reset_password_token: null,
      reset_password_expires: null,
    });
  }

  async loginService(userData: Pick<IUser, "user_name" | "password">) {
    const { user_name, password } = userData;

    const user = await this.userRepo.findByUserName(user_name);
    const isPasswordValid = user ? await bcrypt.compare(password, user.password) : false;

    // Same error for both "user not found" and "wrong password" — prevents user enumeration
    if (!user || !isPasswordValid) {
      throw new HttpException(401, "Invalid credentials");
    }

    const accessToken = generateAccessToken(user as ITokenPayload);
    const refreshToken = generateRefreshToken(user as ITokenPayload);
    return { user, accessToken, refreshToken };
  }

  refreshTokenService(refreshToken: string) {
    if (!refreshToken) {
      throw new HttpException(401, "No refresh token provided");
    }

    try {
      const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as ITokenPayload;
      const newAccessToken = generateAccessToken(decoded);
      return { newAccessToken };
    } catch {
      throw new HttpException(403, "Invalid or expired refresh token");
    }
  }

  async changePasswordService(userId: number, oldPassword: string, newPassword: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new HttpException(404, "User not found");
    }

    const isOldPasswordMatching = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordMatching) {
      throw new HttpException(400, "Old password is incorrect");
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
  }

  async forgotPasswordService(email: string) {
    const user = await this.userRepo.findByEmail(email);
    // Do not reveal whether the email exists or not
    if (!user) return true;

    const token = generateRandomToken();
    user.reset_password_token = token;
    user.reset_password_expires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    const resetLink = `${CLIENT_URL}/reset-password?token=${token}`;
    await transporter.sendMail({
      to: email,
      subject: "Reset Password",
      html: `<h3>Reset Password</h3><p>Click the link below to reset your password (valid for 15 minutes):</p><a href="${resetLink}">${resetLink}</a>`,
    });

    return true;
  }

  async resetPasswordService(token: string, newPassword: string) {
    const user = await this.userRepo.findByResetToken(token);
    if (!user) {
      throw new HttpException(400, "Invalid or expired reset token");
    }

    if (!user.reset_password_expires || user.reset_password_expires < new Date()) {
      throw new HttpException(400, "Reset token has expired");
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.reset_password_token = null;
    user.reset_password_expires = null;
    await user.save();

    return true;
  }
}
