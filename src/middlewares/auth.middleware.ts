import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "@/configs/env";
import { Request, Response, NextFunction } from "express";

export const AuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.accessToken;
  if (!token) {
    res.status(401).json({ status: 401, message: "User is not authorized or token is missing" });
  }
  jwt.verify(token, ACCESS_TOKEN_SECRET, (err) => {
    if (err) {
      res.status(401);
      throw new Error("User is not authorized");
    }
    next();
  });
};
