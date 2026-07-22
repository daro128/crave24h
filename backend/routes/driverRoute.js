import express from "express";

import {
  getAssignedDeliveries,
  pickupOrder,
  deliverOrder,
  getAvailableDeliveries,
  acceptDelivery,
  declineDelivery
} from "../controller/driverController.js";

const router = express.Router();

router.get(
  "/orders/:driver_id",
  getAssignedDeliveries
);

router.put(
  "/orders/:id/pickup",
  pickupOrder
);

router.put(
  "/orders/:id/delivered",
  deliverOrder
);

router.get("/available", getAvailableDeliveries);

router.patch("/accept/:delivery_id", acceptDelivery);
router.patch("/decline/:delivery_id", declineDelivery); 

export default router;