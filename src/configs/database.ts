import { Sequelize } from "sequelize";
import { logger } from "@/shared/utils/logger";

import {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_DB,
  NODE_ENV,
} from "@/configs/env";

export const sequelize = new Sequelize({
  database: POSTGRES_DB,
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  host: POSTGRES_HOST,
  port: Number(POSTGRES_PORT),
  dialect: "postgres",

  logging: NODE_ENV === "development" ? (sql) => logger.debug(sql) : false,

  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },

  dialectOptions: {
    ssl: false,
  },
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
  },
});

export const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    logger.info("✅ PostgreSQL connected");
  } catch (error) {
    logger.error(`❌ Database connection error: ${error}`);
    process.exit(1);
  }
};
