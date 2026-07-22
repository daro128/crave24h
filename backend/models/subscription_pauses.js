import { DataTypes } from "sequelize";
import sequelize from "../database/db.js";

const SubscriptionPause = sequelize.define(
  "SubscriptionPause",
  {
    pause_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    subscription_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    pause_start: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    pause_resume: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    duration_days: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("active", "completed"),
      defaultValue: "active",
    },
  },
  {
    tableName: "subscription_pauses",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

export default SubscriptionPause;
