import { Router } from "express";
import { IRoutes } from "@/interfaces/routes.interface";
import { AuthController } from "@/controllers/auth.controller";
import { CreateUserDto } from "@/dtos/user.dto";
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
      ValidationMiddleware(CreateUserDto),
      this.auth.register.bind(this.auth),
    );
    this.router.post(
      "/login",
      ValidationMiddleware(CreateUserDto),
      this.auth.login.bind(this.auth),
    );
    this.router.post("/logout", this.auth.logout.bind(this.auth));
    this.router.post("/refreshToken", this.auth.refreshToken.bind(this.auth));
    this.router.post("/changePassword", this.auth.changePassword.bind(this.auth));
  }
}
