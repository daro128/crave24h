import express from "express";

import {
  getRestaurantOrders,
  acceptOrder,
  prepareOrder,
  readyForPickup,
} from "../controller/restaurantController.js";

const router = express.Router();

router.get(
  "/orders/:restaurant_id",
  getRestaurantOrders
);

router.put(
  "/orders/:id/accept",
  acceptOrder
);

router.put(
  "/orders/:id/preparing",
  prepareOrder
);

router.put(
  "/orders/:id/ready",
  readyForPickup
);

export default router;