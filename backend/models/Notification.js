import { DataTypes } from "sequelize";
import sequelize from "../database/db.js";

const Notification = sequelize.define(
  "Notification",
  {
    notification_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    type: {
      type: DataTypes.ENUM(
        "order",
        "payment",
        "coupon",
        "promotion",
        "subscription",
        "group_order",
        "system"
      ),
      allowNull: false,
      defaultValue: "system",
    },

    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    is_read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "notifications",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

export default Notification;