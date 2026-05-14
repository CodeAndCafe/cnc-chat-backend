import { Router } from "express";
import { IRoutes } from "@/shared/interfaces/routes.interface";
import { AuthController } from "./auth.controller";
import { RegisterUserDto } from "./dtos/register-user.dto";
import { LoginDto } from "./dtos/login.dto";
import { ChangePasswordDto } from "./dtos/change-password.dto";
import { ForgotPasswordDto } from "./dtos/forgot-password.dto";
import { ResetPasswordDto } from "./dtos/reset-password.dto";
import { AuthMiddleware } from "@/shared/middlewares/auth.middleware";
import { ValidationMiddleware } from "@/shared/middlewares/validation.middleware";
import { authRateLimiter } from "@/shared/middlewares/rate-limit.middleware";

export class AuthRoute implements IRoutes {
  public path = "/auth";
  public router: Router = Router();
  public auth!: AuthController;

  constructor() {
    this.auth = new AuthController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      "/register",
      authRateLimiter,
      ValidationMiddleware(RegisterUserDto),
      this.auth.register.bind(this.auth),
    );
    this.router.post(
      "/login",
      authRateLimiter,
      ValidationMiddleware(LoginDto),
      this.auth.login.bind(this.auth),
    );
    this.router.post("/logout", this.auth.logout.bind(this.auth));
    this.router.post("/refresh-token", this.auth.refreshToken.bind(this.auth));
    this.router.post(
      "/change-password",
      AuthMiddleware,
      ValidationMiddleware(ChangePasswordDto),
      this.auth.changePassword.bind(this.auth),
    );
    this.router.post(
      "/forgot-password",
      authRateLimiter,
      ValidationMiddleware(ForgotPasswordDto),
      this.auth.forgotPassword.bind(this.auth),
    );
    this.router.post(
      "/reset-password",
      authRateLimiter,
      ValidationMiddleware(ResetPasswordDto),
      this.auth.resetPassword.bind(this.auth),
    );
  }
}
