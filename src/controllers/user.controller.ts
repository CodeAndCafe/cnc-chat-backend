import { Container } from "typedi";
import { User } from "@/interfaces/users.interface";
import { II18nRequest } from "@/interfaces/i18n.interface";
import { UserService } from "@/services/users.service";
import { NextFunction, Request, Response } from "express";
export class UserController {
  private user: UserService;
  constructor() {
    this.user = Container.get(UserService);
  }
  // [GET]/users
  public getAllUser = async (req: II18nRequest, res: Response, next: NextFunction) => {
    try {
      const users = await this.user.allUserService();
      res.status(200).json({
        status: 200,
        data: users,
        message: req.t("success"),
      });
    } catch (error) {
      next(error);
    }
  };
}
