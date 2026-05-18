import { Container } from "typedi";
import { NODE_ENV } from "@/configs/env";
import { AuthService } from "./auth.service";
import { NextFunction, Request, Response } from "express";

export class AuthController {
  private auth: AuthService;

  constructor() {
    this.auth = Container.get(AuthService);
  }

  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.auth.registerService(req.body);
      res.status(201).json({ status: 201, message: "User registered successfully." });
    } catch (error) {
      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user, accessToken, refreshToken } = await this.auth.loginService(req.body);
      const isProduction = NODE_ENV === "production";

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "strict",
        path: "/",
        maxAge: 15 * 60 * 1000,
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.cookie("isLoggedIn", "true", {
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({ status: 200, userId: user.id });
    } catch (error) {
      next(error);
    }
  };

  public logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie("accessToken", { path: "/" });
      res.clearCookie("refreshToken", { path: "/" });
      res.clearCookie("isLoggedIn", { path: "/" });
      res.status(200).json({ status: 200, message: "Logged out successfully." });
    } catch (error) {
      next(error);
    }
  };

  public refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.cookies;
      const { newAccessToken } = await this.auth.refreshTokenService(refreshToken);
      const isProduction = NODE_ENV === "production";

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "strict",
        path: "/",
        maxAge: 15 * 60 * 1000,
      });
      res.status(200).json({ status: 200, message: "Access token refreshed." });
    } catch (error) {
      next(error);
    }
  };

  public changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      const { current_password, new_password } = req.body;
      await this.auth.changePasswordService(userId, current_password, new_password);
      res.status(200).json({ status: 200, message: "Password changed successfully." });
    } catch (error) {
      next(error);
    }
  };

  public forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      await this.auth.forgotPasswordService(email);
      // Always return success to not reveal if email exists
      res.status(200).json({ status: 200, message: "If this email is registered, a reset link has been sent." });
    } catch (error) {
      next(error);
    }
  };

  public resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token, newPassword } = req.body;
      await this.auth.resetPasswordService(token, newPassword);
      res.status(200).json({ status: 200, message: "Password reset successfully." });
    } catch (error) {
      next(error);
    }
  };
}
