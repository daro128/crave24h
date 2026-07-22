import { DataTypes } from "sequelize";
import sequelize from "../database/db.js";

const Promotion = sequelize.define(
  "Promotion",
  {
    promotion_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    restaurant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    code: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },

    discount_percent: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
    },

    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    redemptions: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "promotions",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

export default Promotion;
