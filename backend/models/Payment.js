import { DataTypes } from "sequelize";
import sequelize from "../database/db.js";

const Payment = sequelize.define(
  "Payment",
  {
    payment_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },

    payment_method: {
      type: DataTypes.ENUM(
        "cash",
        "KHQR",
        "CARD",
      ),
      allowNull: false,
    },

    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
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

    transaction_id: {
      type: DataTypes.STRING(255),
    },
  },
  {
    tableName: "payments",
    timestamps: true,
    createdAt: "payment_date",
    updatedAt: false,
  }
);

export default Payment;