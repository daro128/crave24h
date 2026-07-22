import { DataTypes } from "sequelize";
import sequelize from "../database/db.js";

const Product = sequelize.define(
  "Product",
  {
    product_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    restaurant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    product_name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
    },

    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    image: {
      type: DataTypes.STRING(255),
    },

    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    status: {
      type: DataTypes.ENUM(
        "available",
        "unavailable"
      ),
      defaultValue: "available",
    },
  },
  {
    tableName: "products",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Product;