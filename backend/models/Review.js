import { DataTypes } from "sequelize";
import sequelize from "../database/db.js";

const Review = sequelize.define(
  "Review",
  {
    review_id: {
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

    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },

    comment: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "reviews",
    timestamps: true,
    createdAt: "review_date",
    updatedAt: false,
    indexes: [
      {
        unique: true,
        fields: ["customer_id", "product_id"],
      },
    ],
  }
);

export default Review;