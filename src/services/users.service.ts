import { Service } from "typedi";
import { User } from "@/interfaces/users.interface";
import db from "@/models";
import { HttpException } from "@/exceptions/httpException";

@Service()
export class UserService {
  public async allUserService() {
    const users = await db.User.findAll();
    return users;
  }
}
