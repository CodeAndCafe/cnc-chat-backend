import { Router } from "express";
import { IRoutes } from "@/interfaces/routes.interface";
import { AuthMiddleware } from "@/middlewares/auth.middleware";
import { UserController } from "@/controllers/user.controller";
export class UserRoute implements IRoutes {
  public path = "/users";
  public router = Router();
  public user!: UserController;

  constructor() {
    this.user = new UserController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/", this.user.getAllUser.bind(this.user));
  }
}
