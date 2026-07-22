import express from "express";
import {
  createOrder,
  getCustomerOrders,
} from "../controller/orderController.js";

const router = express.Router();

router.post("/", createOrder);

router.get(
  "/customer/:customer_id",
  getCustomerOrders
);


/* PATCH /api/orders/:id/status
   body: { order_status } 
   Used by restaurant to advance order status */
router.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { order_status } = req.body;

    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.order_status = order_status;
    await order.save();

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* POST /api/deliver/assign
   body: { order_id, driver_id }
   Creates a delivery record and links it to an order */
router.post("/assign", async (req, res) => {
  try {
    const { order_id, driver_id } = req.body;

    const delivery = await Delivery.create({
      order_id,
      driver_id,
      delivery_status: "assigned",
      pickup_time: null,
      delivery_time: null,
    });

    // Mark driver as busy
    await Driver.update(
      { current_status: "busy" },
      { where: { driver_id } }
    );

    res.status(201).json({ success: true, data: delivery });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;