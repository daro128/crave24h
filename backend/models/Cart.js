import { DataTypes } from "sequelize";
import sequelize from "../database/db.js";

const Cart = sequelize.define(
  "Cart",
  {
    cart_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "carts",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

export default Cart;