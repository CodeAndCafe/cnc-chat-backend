import { Container } from "typedi";
import { NODE_ENV } from "@/configs/env";
import { User } from "@/interfaces/users.interface";
import { AuthService } from "@/services/auth.service";
import { NextFunction, Request, Response } from "express";
export class AuthController {
  private auth: AuthService;
  constructor() {
    this.auth = Container.get(AuthService);
  }
  // [POST]/register
  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.body;
      await this.auth.registerService(userData);
      res.status(201).json({ status: 201, message: "successfully!" });
    } catch (error) {
      next(error);
    }
  };

  // [POST]/Login
  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.body;
      const { userAvailable, accessToken, refreshToken } = await this.auth.loginService(userData);
      const isProduction = NODE_ENV === "production";
      // Set cookie HttpOnly
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "strict",
        path: "/",
        maxAge: 15 * 60 * 1000, // 15 minutes
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      res.cookie("isLoggedIn", true, {
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(200).json({
        userId: userAvailable.id,
        userRole: "user",
      });
    } catch (error) {
      next(error);
    }
  };

  //[POST]/Log out
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

  //[POST]/Refresh token
  public refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        return res.status(401).json({ status: 401, message: "No refresh token provided" });
      }
      const { newAccessToken } = await this.auth.refreshTokenService(refreshToken);
      const isProduction = process.env.ENV_DEPLOY === "production";
      // Set cookie HttpOnly
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "strict",
        path: "/",
        maxAge: 15 * 60 * 1000, // 15 minutes
      });
      return res.status(200).json({ status: 200, message: "Access token refreshed" });
    } catch (error) {
      next(error);
    }
  };
}
