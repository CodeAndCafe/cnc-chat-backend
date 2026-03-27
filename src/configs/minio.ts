import { Client } from "minio";
import {
  MINIO_HOST,
  MINIO_PORT,
  MINIO_USE_SSL,
  MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY,
} from "@/configs/env";
console.log(MINIO_USE_SSL);
export const minioClient = new Client({
  endPoint: MINIO_HOST,
  port: Number(MINIO_PORT),
  useSSL: MINIO_USE_SSL === "true",
  accessKey: MINIO_ACCESS_KEY,
  secretKey: MINIO_SECRET_KEY,
});
