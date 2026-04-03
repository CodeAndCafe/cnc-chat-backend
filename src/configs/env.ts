import { config } from "dotenv";
config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === "true";
// General
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
// PostgreSQL
export const { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_HOST, POSTGRES_PORT, POSTGRES_DB } =
  process.env;
// Minio
export const {
  MINIO_PORT,
  MINIO_HOST,
  MINIO_BUCKET,
  MINIO_CONSOLE_PORT,
  MINIO_ROOT_USER,
  MINIO_ROOT_PASSWORD,
  MINIO_USE_SSL,
  MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY,
  MINIO_PUBLIC_URL,
} = process.env;
// Mail
export const { MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASSWORD } = process.env;
