import { DataTypes } from "sequelize";
import sequelize from "../database/db.js";

const Customer = sequelize.define(
  "Customer",
  {
    customer_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },

    address: {
      type: DataTypes.TEXT,
    },

    city: {
      type: DataTypes.STRING(100),
    },

    latitude: {
      type: DataTypes.DECIMAL(10, 8),
    },

    longitude: {
      type: DataTypes.DECIMAL(11, 8),
    },
  },
  {
    tableName: "customers",
    timestamps: false,
  }
);

export default Customer;