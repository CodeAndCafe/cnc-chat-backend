import { Request } from "express";
import { TFunction } from "i18next";

export interface II18nRequest extends Request {
  t: TFunction;
}
