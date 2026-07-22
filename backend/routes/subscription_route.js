import express from "express";
import {
  createSubscription,
  getActiveSubscription,
  getSubscriptionById,
  pauseSubscription,
  resumeSubscription,
  cancelSubscription,
  getRefund,
  updateMealSchedule,
  saveMealChoice,
  getMealChoice,
  getMealChoicesRange,
} from "../controller/subscription_controller.js";
import { verifyToken } from "../middleware/auth_middleware.js";

const router = express.Router();

router.post("/", verifyToken, createSubscription);
router.get("/active", verifyToken, getActiveSubscription);
router.get("/:subscription_id", verifyToken, getSubscriptionById);
router.post("/:subscription_id/pause", verifyToken, pauseSubscription);
router.post("/:subscription_id/resume", verifyToken, resumeSubscription);
router.post("/:subscription_id/cancel", verifyToken, cancelSubscription);
router.get("/:subscription_id/refund", verifyToken, getRefund);
router.put("/:subscription_id/schedule", verifyToken, updateMealSchedule);
router.get("/:subscription_id/meal-choices", verifyToken, getMealChoicesRange);
router.put("/:subscription_id/meal-choice/:date", verifyToken, saveMealChoice);
router.get("/:subscription_id/meal-choice/:date", verifyToken, getMealChoice);

export default router;
