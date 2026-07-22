import { DataTypes } from "sequelize";
import sequelize from "../database/db.js";

const DailyMealChoice = sequelize.define(
  "DailyMealChoice",
  {
    choice_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    subscription_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    choice_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    lunch_item_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    dinner_item_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    supper_item_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    breakfast_item_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  },
  {
    tableName: "daily_meal_choices",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        unique: true,
        fields: ["subscription_id", "choice_date"],
      },
    ],
  }
);

export default DailyMealChoice;
