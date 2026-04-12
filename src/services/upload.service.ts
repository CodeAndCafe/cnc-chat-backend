import { Service } from "typedi";
import { minioClient } from "@/configs/minio";
import { HttpException } from "@/exceptions/httpException";

@Service()
export class UploadService {
  // [POST]/upload image
  public async uploadImageService(file: Express.Multer.File) {
    if (!file) {
      throw new HttpException(400, "No file uploaded");
    }
    const fileName = `${Date.now()}-${file.originalname}`;
    await minioClient.putObject("uploads", fileName, file.buffer, file.size, {
      "Content-Type": file.mimetype,
    });
    return fileName;
  }
}
