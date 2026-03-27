import { Service } from "typedi";
import db from "@/models";

@Service()
export class UserService {
  public async allUserService() {
    const users = await db.User.findAll();
    return users;
  }
}
