import express from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  trackOrder,
} from "../controller/order_controller.js";
import { verifyToken } from "../middleware/auth_middleware.js";

const router = express.Router();

router.post("/", verifyToken, createOrder);
router.get("/", verifyToken, getOrders);
router.get("/:order_id", verifyToken, getOrderById);
router.get("/:order_id/status", verifyToken, trackOrder);

export default router;