import { DataTypes } from "sequelize";
import sequelize from "../database/db.js";

const Subscription = sequelize.define(
  "Subscription",
  {
    subscription_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    restaurant_ref_id: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    restaurant_name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    restaurant_image: {
      type: DataTypes.STRING(255),
    },

    plan_id: {
      type: DataTypes.ENUM("basic", "standard", "family"),
      allowNull: false,
    },

    plan_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    plan_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    meals_per_day: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    duration_days: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 30,
    },

    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    discount_amount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },

    coupon_code: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    payment_method: {
      type: DataTypes.ENUM("khqr", "card", "cash"),
      allowNull: false,
    },

    payment_status: {
      type: DataTypes.ENUM("pending", "paid", "failed", "refunded"),
      defaultValue: "pending",
    },

    status: {
      type: DataTypes.ENUM("active", "paused", "cancelled", "completed"),
      defaultValue: "active",
    },

    days_used: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    pause_start: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    pause_resume: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    cancelled_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "subscriptions",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Subscription;
