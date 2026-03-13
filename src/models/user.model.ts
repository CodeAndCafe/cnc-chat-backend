import { Model, DataTypes, Sequelize, Optional } from "sequelize";

export class UserModel extends Model {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public confirmPassword!: string;
  public fullName!: string;
  public dateOfBirth!: string;
  public avatarImageUrl!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initUserModel = (sequelize: Sequelize) => {
  UserModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      username: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notNull: {
            msg: "please add the user name",
          },
        },
      },

      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: {
          name: "unique_email",
          msg: "Email address already taken",
        },
        validate: {
          isEmail: true,
          notNull: {
            msg: "please add the user email address",
          },
        },
      },

      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notNull: {
            msg: "please add the user password",
          },
        },
      },

      fullName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notNull: {
            msg: "please add the user fullName",
          },
        },
      },

      dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          notNull: {
            msg: "please add the user date of birth",
          },
        },
      },

      avatarImageUrl: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notNull: {
            msg: "please add the user date of birth",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      timestamps: true,
    },
  );
  return UserModel;
};
