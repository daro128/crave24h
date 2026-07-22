import { DataTypes } from "sequelize";
import sequelize from "../database/db.js";

const Driver = sequelize.define(
  "Driver",
  {
    driver_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },

    vehicle_type: {
      type: DataTypes.STRING(50),
    },

    license_number: {
      type: DataTypes.STRING(100),
    },

    current_status: {
      type: DataTypes.ENUM(
        "available",
        "busy",
        "offline"
      ),
      defaultValue: "available",
    },

    current_latitude: {
      type: DataTypes.DECIMAL(10, 8),
    },

    current_longitude: {
      type: DataTypes.DECIMAL(11, 8),
    },
  },
  {
    tableName: "drivers",
    timestamps: false,
  }
);

export default Driver;