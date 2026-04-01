import { Model, DataTypes, Sequelize } from "sequelize";

export class UserModel extends Model {
  public id!: number;
  public user_name!: string;
  public email!: string;
  public password!: string;
  public confirm_password!: string;
  public full_name!: string;
  public date_of_birth!: string;
  public avatar_image_url!: string;

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

      user_name: {
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

      confirm_password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notNull: {
            msg: "please add the user confirm password",
          },
        },
      },

      full_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notNull: {
            msg: "please add the user full name",
          },
        },
      },

      date_of_birth: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          notNull: {
            msg: "please add the user date of birth",
          },
        },
      },

      avatar_image_url: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notNull: {
            msg: "please add the user avatar image url",
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
