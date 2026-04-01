import { Container } from "typedi";
import { MINIO_PUBLIC_URL } from "@/configs/env";
import { UploadService } from "@/services/upload.service";
import { NextFunction, Request, Response } from "express";

export class UploadController {
  private uploadService: UploadService;
  constructor() {
    this.uploadService = Container.get(UploadService);
  }
  public async uploadImage(req: Request, res: Response, next: NextFunction) {
    try {
      const file = req.file;
      // console.log(req.file);

      const fileName = await this.uploadService.uploadImageService(file);
      return res.status(201).json({
        status: 201,
        message: "Upload success",
        fileName,
        url: `${MINIO_PUBLIC_URL}/uploads/${fileName}`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 500, message: "Upload failed" });
      next(error);
    }
  }
}
