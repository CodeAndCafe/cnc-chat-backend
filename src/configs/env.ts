import { config } from "dotenv";
config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === "true";
export const {
  NODE_ENV,
  PORT,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  LOG_FORMAT,
  LOG_DIR,
  ORIGIN,
  HOST_NAME,
} = process.env;
export const { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_HOST, POSTGRES_PORT, POSTGRES_DB } =
  process.env;
export const {
  MINIO_PORT,
  MINIO_HOST,
  MINIO_CONSOLE_PORT,
  MINIO_ROOT_USER,
  MINIO_ROOT_PASSWORD,
  MINIO_USE_SSL,
  MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY,
} = process.env;
