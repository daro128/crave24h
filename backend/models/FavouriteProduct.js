import { DataTypes } from "sequelize";
import sequelize from "../database/db.js";
const FavouriteProduct = sequelize.define(
  "FavouriteProduct",
  {
    favourite_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "favourite_products",
    timestamps: false,
    createdAt: "created_at",
    updatedAt: false,
  }
);

export default FavouriteProduct;