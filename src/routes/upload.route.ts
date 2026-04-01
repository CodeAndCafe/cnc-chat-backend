import { Router } from "express";
import { upload } from "@/middlewares/upload.middleware";
import { IRoutes } from "@/interfaces/routes.interface";
import { UploadController } from "@/controllers/upload.controller";

export class UploadRoute implements IRoutes {
  public path = "/uploads";
  public router: Router = Router();
  public upload!: UploadController;

  constructor() {
    this.upload = new UploadController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/", upload.single("file"), this.upload.uploadImage.bind(this.upload));
  }
}
