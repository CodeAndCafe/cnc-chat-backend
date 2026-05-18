import { Router } from "express";
import { IRoutes } from "@/shared/interfaces/routes.interface";
import { AuthMiddleware } from "@/shared/middlewares/auth.middleware";
import { UserController } from "./user.controller";

export class UserRoute implements IRoutes {
  public path = "/users";
  public router = Router();
  public user!: UserController;

  constructor() {
    this.user = new UserController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/", AuthMiddleware, this.user.getAllUser.bind(this.user));
  }
}
