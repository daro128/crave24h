import { DataTypes } from "sequelize";
import sequelize from "../database/db.js";

const SubscriptionDeliveryDay = sequelize.define(
  "SubscriptionDeliveryDay",
  {
    delivery_day_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    subscription_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    day_name: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
  },
  {
    tableName: "subscription_delivery_days",
    timestamps: false,
  }
);

export default SubscriptionDeliveryDay;
