import express from "express";
import { verifyToken } from "../middleware/auth_middleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { upload } from "../middleware/upload.js";
import {
  getAllUsers,
  getAllRestaurants,
  getAllDeliveries,
  getMe,
  getDashboardStats,
  updateProfileHandler,

  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,

  createRestaurant,
  updateRestaurant,
  deleteRestaurant,

  toggleDriverStatus,
  updateDriver,
  deleteDriver
} from "../controller/adminController.js";

const router = express.Router();

router.use(verifyToken, authorizeRoles("admin"));

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management APIs
 */

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of all users
 */
router.get("/users", getAllUsers);

/**
 * @swagger
 * /admin/restaurants:
 *   get:
 *     summary: Get all restaurants
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of all restaurants
 */
router.get("/restaurants", getAllRestaurants);

/**
 * @swagger
 * /admin/deliveries:
 *   get:
 *     summary: Get all delivery drivers
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of all deliveries
 */
router.get("/deliveries", getAllDeliveries);

/**
 * @swagger
 * /admin/profile:
 *   get:
 *     summary: Get current admin profile
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin profile
 *       401:
 *         description: Unauthorized
 */
router.get("/profile", getMe);

/**
 * @swagger
 * /admin/dashboard:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 */
router.get("/dashboard", getDashboardStats);

router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.patch("/users/:id/status", toggleUserStatus);
router.delete("/users/:id", deleteUser);
router.patch("/deliveries/:id/status", toggleDriverStatus);
router.put("/deliveries/:id", updateDriver);
router.delete("/deliveries/:id", deleteDriver);
const restaurantImageFields = upload.fields([
  { name: "logo", maxCount: 1 },
  { name: "image", maxCount: 1 },
]);

router.post("/restaurants", restaurantImageFields, createRestaurant);
router.put("/restaurants/:id", restaurantImageFields, updateRestaurant);
router.delete("/restaurants/:id", deleteRestaurant);
router.put("/profile", updateProfileHandler);

export default router;