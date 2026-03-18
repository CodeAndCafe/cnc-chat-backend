import "reflect-metadata";
import express from "express";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import i18next from "@/plugins/i18n";
import middleware from "i18next-http-middleware";
import { errorMiddleware } from "./middlewares/error.middleware";
import { SwaggerDocs } from "@/swagger";
import { logger, stream } from "@/utils/logger";
import { IRoutes } from "@/interfaces/routes.interface";
import { NODE_ENV, PORT, LOG_FORMAT, ORIGIN, CREDENTIALS, HOST_NAME } from "@/configs/env";

export class App {
  public app: express.Application;
  public env: string;
  public port: number;
  public hostName: string = HOST_NAME || "localhost";

  constructor(routes: IRoutes[]) {
    this.app = express();
    this.env = NODE_ENV || "development";
    this.port = Number(PORT) || 8888;
    this.initializeMiddlewares();
    this.initializeSwagger();
    this.initializeI18next();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  }
  public listen() {
    this.app.listen(this.port, "0.0.0.0", () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}, host ${this.hostName}`);
      logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
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
