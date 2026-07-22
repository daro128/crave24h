import { DataTypes } from "sequelize";
import sequelize from "../database/db.js";

const Order = sequelize.define(
  "Order",
  {
    order_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    restaurant_id: {
      type: DataTypes.INTEGER,
    allowNull: false,
    },

    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    delivery_fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },

    discount_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
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

    order_status: {
      type: DataTypes.ENUM(
        "pending",
        "accepted",
        "preparing",
        "out_for_delivery",
        "delivered",
        "cancelled"
      ),
      defaultValue: "pending",
    },

    payment_status: {
      type: DataTypes.ENUM(
        "pending",
        "paid",
        "failed",
        "refunded"
      ),
      defaultValue: "pending",
    },

    delivery_address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "orders",
    timestamps: true,
    createdAt: "order_date",
    updatedAt: false,
  }
);

export default Order;