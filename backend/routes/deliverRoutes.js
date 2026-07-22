import express from "express";
import {
  getProfile,
  getDriverStats,
  getDeliveryHistory,
  getActiveDelivery,
  updateDeliveryStatus,
  updateProfile,
} from "../controller/deliverController.js";

const router = express.Router();

// Profile
router.post("/profile",              getProfile);
router.patch("/profile/:user_id",    updateProfile);

// Stats & history
router.get("/stats/:driver_id",      getDriverStats);
router.get("/history/:driver_id",    getDeliveryHistory);

// Active delivery
router.get("/active/:driver_id",     getActiveDelivery);
router.patch("/status/:delivery_id", updateDeliveryStatus);

export default router;