import { Router } from "express";
import { IRoutes } from "@/interfaces/routes.interface";

import { AuthController } from "@/controllers/auth.controller";
import { RegisterUserDto } from "@/dtos/auth/register-user.dto";
import { LoginDto } from "@/dtos/auth/login.dto";
import { ForgotPasswordDto } from "@/dtos/auth/forgot-password.dto";
import { ResetPasswordDto } from "@/dtos/auth/reset-password.dto";

import { AuthMiddleware } from "@/middlewares/auth.middleware";
import { ValidationMiddleware } from "@/middlewares/validation.middleware";

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
      ValidationMiddleware(RegisterUserDto),
      this.auth.register.bind(this.auth),
    );
    this.router.post("/login", ValidationMiddleware(LoginDto), this.auth.login.bind(this.auth));
    this.router.post("/logout", this.auth.logout.bind(this.auth));
    this.router.post("/refresh-token", this.auth.refreshToken.bind(this.auth));
    this.router.post("/change-password", AuthMiddleware, this.auth.changePassword.bind(this.auth));
    this.router.post(
      "/forgot-password",
      ValidationMiddleware(ForgotPasswordDto),
      this.auth.forgotPassword.bind(this.auth),
    );
    this.router.post(
      "/reset-password",
      ValidationMiddleware(ResetPasswordDto),
      this.auth.resetPassword.bind(this.auth),
    );
  }
}
