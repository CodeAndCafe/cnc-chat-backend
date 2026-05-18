import { Service } from "typedi";
import { minioClient } from "@/configs/minio";
import { HttpException } from "@/shared/exceptions/httpException";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

@Service()
export class UploadService {
  async uploadImageService(file: Express.Multer.File) {
    if (!file) {
      throw new HttpException(400, "No file uploaded");
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new HttpException(400, "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.");
    }

    // Sanitize filename to prevent path traversal
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    const fileName = `${Date.now()}-${sanitizedName}`;

    await minioClient.putObject("uploads", fileName, file.buffer, file.size, {
      "Content-Type": file.mimetype,
    });

    return fileName;
  }
}
