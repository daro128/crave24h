import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import sequelize from "./database/db.js";
import * as Model from "./models/associations.js";

import authRoutes from "./routes/auth_route.js";
import adminRoutes from "./routes/adminRoute.js"
import deliverRoutes from "./routes/deliverRoutes.js"

import restaurantRoute from "./routes/restaurantRoute.js";
import driverRoute from "./routes/driverRoute.js";
import sellerRoutes from "./routes/sellerRoutes.js";

// import swaggerUi from "swagger-ui-express";
// import swaggerSpec from "./config/swagger.js";

import CustomerRoutes from "./routes/Customer_route.js"
import CartRoutes from "./routes/cart_route.js";
import OrderRoute from "./routes/Order_route.js"
import ReviewRoute from "./routes/Review_route.js"
import ProductRoute from "./routes/Product_route.js"
import CategoryRoute from "./routes/categoryroute.js"
import FavauriteRoute from "./routes/favourithroute.js"
import NotificationRoute from "./routes/notification_route.js"
import CouponRoute from "./routes/couponRoute.js"
import PublicRestaurantRoute from "./routes/publicRestaurantRoute.js"
import SubscriptionRoute from "./routes/subscription_route.js"

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/deliver", deliverRoutes);

app.use("/api/restaurant",restaurantRoute);
app.use("/api",PublicRestaurantRoute);
app.use("/api/driver", driverRoute);
app.use("/api/seller", sellerRoutes);

app.use("/api",CustomerRoutes);
app.use("/api",CartRoutes)
app.use("/api/orders",OrderRoute)
app.use("/api",ReviewRoute)
app.use("/api",ProductRoute)
app.use("/api",CategoryRoute)
app.use("/api",FavauriteRoute)
app.use("/api",NotificationRoute)
app.use("/api",CouponRoute)
app.use("/api/subscription",SubscriptionRoute)

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log(" Database connected");

    await sequelize.sync();
    console.log(" Models synchronized");
    
    app.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
}

startServer();

