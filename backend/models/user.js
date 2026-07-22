import { DataTypes } from "sequelize";
import sequelize from "../database/db.js";

const User = sequelize.define(
  "User",
  {
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    full_name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },

    phone: {
      type: DataTypes.STRING(20),
      unique: true,
    },

    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    role: {
      type: DataTypes.ENUM(
        "admin",
        "customer",
        "restaurant_owner",
        "driver"
      ),
      defaultValue: "customer",
    },

    status: {
      type: DataTypes.ENUM(
        "active",
        "inactive",
        "suspended"
      ),
      defaultValue: "active",
    },
    refresh_token: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

  },
  {
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default User;