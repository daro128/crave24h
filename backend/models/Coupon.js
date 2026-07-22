import { DataTypes } from "sequelize";
import sequelize from "../database/db.js";

const Coupon = sequelize.define(
  "Coupon",
  {
    coupon_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    code: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
    },

    discount_type: {
      type: DataTypes.ENUM("percent", "fixed"),
      allowNull: false,
    },

    discount_value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    min_order: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },

    max_discount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },

    usage_limit: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    used_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    start_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    end_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "coupons",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

export default Coupon;