import { DataTypes } from "sequelize";
import sequelize from "../database/db.js";

const CartItem = sequelize.define(
  "CartItem",
  {
    cart_item_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    cart_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
    },
  },
  {
    tableName: "cart_items",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["cart_id", "product_id"],
      },
    ],
  }
);

export default CartItem;