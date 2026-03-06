import { ERROR_STATUS } from "@/constants/error";
import { NextFunction, Request, Response } from "express";
import { IErrorHttps } from "@/interfaces/errors.interface";

export const errorMiddleware = (
  err: IErrorHttps,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    status: statusCode,
    title: getErrorTitle(statusCode),
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
const getErrorTitle = (status: number) => {
  switch (status) {
    case ERROR_STATUS.VALIDATE_ERROR:
      return "Validation Failed";
    case ERROR_STATUS.UNAUTHORIZED:
      return "Unauthorized";
    case ERROR_STATUS.FORBIDDEN:
      return "Forbidden";
    case ERROR_STATUS.NOT_FOUND:
      return "Not Found";
    default:
      return "Internal Server Error";
  }
};
