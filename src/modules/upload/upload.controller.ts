import { Container } from "typedi";
import { MINIO_PUBLIC_URL } from "@/configs/env";
import { UploadService } from "./upload.service";
import { logger } from "@/shared/utils/logger";
import { NextFunction, Request, Response } from "express";

export class UploadController {
  private uploadService: UploadService;

  constructor() {
    this.uploadService = Container.get(UploadService);
  }

  public uploadImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const file = req.file;
      const fileName = await this.uploadService.uploadImageService(file);
      res.status(201).json({
        status: 201,
        message: "Upload success",
        fileName,
        url: `${MINIO_PUBLIC_URL}/uploads/${fileName}`,
      });
    } catch (error) {
      logger.error(`Upload failed: ${error}`);
      next(error);
    }
  };
}
