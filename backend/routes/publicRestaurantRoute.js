import express from "express";
import {
  getAllRestaurants,
  getRestaurantById,
} from "../controller/restaurantController.js";

const router = express.Router();

router.get("/restaurants", getAllRestaurants);
router.get("/restaurants/:id", getRestaurantById);

export default router;
