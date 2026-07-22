import { DataTypes } from "sequelize";
import sequelize from "../database/db.js";

const Delivery = sequelize.define(
  "Delivery",
  {
    delivery_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },

    driver_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    delivery_status: {
      type: DataTypes.ENUM(
        "assigned",
        "picked_up",
        "on_the_way",
        "delivered"
      ),
      defaultValue: "assigned",
    },

    pickup_time: {
      type: DataTypes.DATE,
    },

    delivery_time: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "deliveries",
    timestamps: false,
  }
);

export default Delivery;