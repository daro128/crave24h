import { DataTypes } from "sequelize";
import sequelize from "../database/db.js";

const FavouriteRestaurant = sequelize.define(
  "FavouriteRestaurant",
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

    restaurant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "favourite_restaurants",
    timestamps: false,
    createdAt: "created_at",
    updatedAt: false,
  }
);

export default FavouriteRestaurant;