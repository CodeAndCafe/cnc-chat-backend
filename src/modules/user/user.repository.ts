import { Service } from "typedi";
import db from "@/models";

@Service()
export class UserRepository {
  async findAll() {
    return db.User.findAll({
      attributes: { exclude: ["password", "reset_password_token", "reset_password_expires"] },
    });
  }

  async findById(id: number) {
    return db.User.findByPk(id);
  }

  async findByUserName(user_name: string) {
    return db.User.findOne({ where: { user_name }, raw: true });
  }

  async findByEmail(email: string) {
    return db.User.findOne({ where: { email } });
  }

  async findByResetToken(token: string) {
    return db.User.findOne({ where: { reset_password_token: token } });
  }

  async create(data: {
    user_name: string;
    email: string;
    password: string;
    full_name: string;
    date_of_birth: string;
    avatar_image_url: string;
    reset_password_token: null;
    reset_password_expires: null;
  }) {
    return db.User.create(data as any);
  }
}
