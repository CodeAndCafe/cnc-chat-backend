import { sequelize } from "@/configs/database";
import { initUserModel } from "@/models/user.model";

export const User = initUserModel(sequelize);

export const db = {
  sequelize,
  User,
};

export default db;
