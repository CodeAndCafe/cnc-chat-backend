import { Router } from "express";
import { IRoutes } from "@/interfaces/routes.interface";
import { AuthRoute } from "./auth.route";
import { UserRoute } from "./users.route";

export class MainRoute implements IRoutes {
  public router: Router = Router();
  public authRouter = new AuthRoute();
  public userRouter = new UserRoute();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use("/auth", () => this.authRouter);
    this.router.use("/users", () => this.userRouter);
  }
}
