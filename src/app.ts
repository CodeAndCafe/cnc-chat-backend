import "reflect-metadata";
import express from "express";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import i18next from "@/plugins/i18n";
import { minioClient } from "@/configs/minio";
import middleware from "i18next-http-middleware";
import { errorMiddleware } from "@/shared/middlewares/error.middleware";
import { SwaggerDocs } from "@/swagger";
import { logger, stream } from "@/shared/utils/logger";
import { IRoutes } from "@/shared/interfaces/routes.interface";
import {
  NODE_ENV,
  PORT,
  LOG_FORMAT,
  ORIGIN,
  CREDENTIALS,
  HOST_NAME,
  MINIO_BUCKET,
} from "@/configs/env";

export class App {
  public app: express.Application;
  public env: string;
  public port: number;
  public hostName: string = HOST_NAME || "0.0.0.0";
  public bucket: string = MINIO_BUCKET || "uploads";

  constructor(routes: IRoutes[]) {
    this.app = express();
    this.env = NODE_ENV || "development";
    this.port = Number(PORT) || 3000;
    this.initializeMiddlewares();
    this.initializeSwagger();
    this.initializeI18next();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, this.hostName, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`App listening on port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  public async initializeMinio() {
    try {
      const exists = await minioClient.bucketExists(this.bucket);
      if (!exists) {
        await minioClient.makeBucket(this.bucket, "us-east-1");
        logger.info(`MinIO bucket created: ${this.bucket}`);
      } else {
        logger.info(`MinIO bucket exists: ${this.bucket}`);
      }

      await minioClient.setBucketPolicy(
        this.bucket,
        JSON.stringify({
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Principal: "*",
              Action: ["s3:GetObject"],
              Resource: [`arn:aws:s3:::${this.bucket}/*`],
            },
          ],
        }),
      );

      logger.info("MinIO bucket policy set (public read)");
    } catch (error) {
      logger.error(`MinIO init error: ${error}`);
    }
  }

  private initializeMiddlewares() {
    this.app.use(morgan(LOG_FORMAT, { stream }));
    this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private initializeSwagger() {
    SwaggerDocs(this.app);
  }

  private initializeRoutes(routes: IRoutes[]) {
    routes.forEach((route) => {
      this.app.use(`/api/v1${route.path}`, route.router);
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initializeI18next() {
    this.app.use(middleware.handle(i18next));
  }
}
