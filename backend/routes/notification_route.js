import express from "express";
import { verifyToken } from "../middleware/auth_middleware.js";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controller/notificationController.js";

const router = express.Router();

router.get("/notifications", verifyToken, getNotifications);

router.get("/notifications/unread-count", verifyToken, getUnreadCount);

router.put("/notifications/:id/read", verifyToken, markAsRead);

router.put("/notifications/read-all", verifyToken, markAllAsRead);

router.delete("/notifications/:id", verifyToken, deleteNotification);

export default router;