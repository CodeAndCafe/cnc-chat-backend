import yaml from "yamljs";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { Request, Response } from "express";

const userSpec = yaml.load("./src/docs/user.yaml");

export const SwaggerDocs = (app: express.Application) => {
  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(null, {
      explorer: true, // bật chọn definition
      swaggerOptions: {
        urls: [
          { url: "/swagger/user.json", name: "User API" },
          { url: "/swagger/upload.json", name: "Upload API" },
        ],
      },
    }),
  );

  //Docs in JSON format
  // User API docs
  app.use("/swagger/user.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(userSpec);
  });
  // Upload API docs
  const uploadSpec = yaml.load("./src/docs/upload.yaml");
  app.use("/swagger/upload.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(uploadSpec);
  });
};
