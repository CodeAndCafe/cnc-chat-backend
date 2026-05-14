import { Service } from "typedi";
import { UserRepository } from "./user.repository";

@Service()
export class UserService {
  constructor(private userRepo: UserRepository) {}

  async allUserService() {
    return this.userRepo.findAll();
  }
}
