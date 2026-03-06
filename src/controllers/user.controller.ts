import { Container } from "typedi";
import { User } from "@/interfaces/users.interface";
import { UserService } from "@/services/users.service";
import { NextFunction, Request, Response } from "express";
export class UserController {
  private user: UserService;
  constructor() {
    this.user = Container.get(UserService);
  }
  // [GET]/users
  public getAllUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(111);

      const users = await this.user.allUserService();
      res.status(200).json({
        status: 200,
        data: users,
        message: "successfully!",
      });
    } catch (error) {
      next(error);
    }
  };
}
