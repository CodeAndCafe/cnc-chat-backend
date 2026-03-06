import { Service } from "typedi";
import { User } from "@/interfaces/users.interface";
import { UserModel } from "@/models/user.model";
import { HttpException } from "@/exceptions/httpException";

@Service()
export class UserService {
  public async allUserService() {
    const users = await UserModel.findAll();
    return users;
  }
}
