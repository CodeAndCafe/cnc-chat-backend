import { Router } from "express";
import { IRoutes } from "@/shared/interfaces/routes.interface";
import { upload } from "@/shared/middlewares/upload.middleware";
import { AuthMiddleware } from "@/shared/middlewares/auth.middleware";
import { uploadRateLimiter } from "@/shared/middlewares/rate-limit.middleware";
import { UploadController } from "./upload.controller";

export class UploadRoute implements IRoutes {
  public path = "/uploads";
  public router: Router = Router();
  public upload!: UploadController;

  constructor() {
    this.upload = new UploadController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      "/",
      AuthMiddleware,
      uploadRateLimiter,
      upload.single("file"),
      this.upload.uploadImage.bind(this.upload),
    );
  }
}
