import { DataTypes } from "sequelize";
import sequelize from "../database/db.js";

const Refund = sequelize.define(
  "Refund",
  {
    refund_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    subscription_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    remaining_meals: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    meal_value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    estimated_value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    refund_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    reason: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM("approved"),
      defaultValue: "approved",
    },
  },
  {
    tableName: "refunds",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

export default Refund;
