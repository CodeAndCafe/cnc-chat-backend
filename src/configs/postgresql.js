import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV || "development"}.local`),
});

export default {
  development: {
    username: process.env.POSTGRES_USER,
    password: String(process.env.POSTGRES_PASSWORD || ""),
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    dialect: "postgres",
  },
  production: {
    username: process.env.POSTGRES_USER,
    password: String(process.env.POSTGRES_PASSWORD || ""),
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    dialect: "postgres",
  },
};
