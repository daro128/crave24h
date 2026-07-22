import {
  Order,
  Customer,
  Notification,
  Driver,
  Delivery,
  Restaurant,
  User,
  Category,
} from "../models/associations.js";

export const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll({
      include: [
        {
          model: User,
          attributes: ["full_name"],
        },
        {
          model: Category,
          attributes: ["category_name"],
        },
      ],
    });

    res.json(restaurants);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["full_name"],
        },
        {
          model: Category,
          attributes: ["category_name"],
        },
      ],
    });

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found",
      });
    }

    res.json(restaurant);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getRestaurantOrders =
  async (req, res) => {
    try {
      const { restaurant_id } =
        req.params;

      const orders =
        await Order.findAll({
          where: { restaurant_id },
          include: [Customer],
          order: [
            ["order_date", "DESC"],
          ],
        });

      res.json(orders);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

export const acceptOrder = async (
  req,
  res
) => {
  try {
    const order =
      await Order.findByPk(
        req.params.id
      );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.order_status =
      "accepted";

    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const prepareOrder = async (
  req,
  res
) => {
  try {
    const order =
      await Order.findByPk(
        req.params.id
      );

    order.order_status =
      "preparing";

    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const readyForPickup =
  async (req, res) => {
    try {
      const order =
        await Order.findByPk(
          req.params.id
        );

      const driver =
        await Driver.findOne({
          where: {
            current_status:
              "available",
          },
        });

      if (!driver) {
        return res
          .status(400)
          .json({
            message:
              "No available drivers",
          });
      }

      await Delivery.create({
        order_id: order.order_id,
        driver_id:
          driver.driver_id,
        delivery_status:
          "assigned",
      });

      driver.current_status =
        "busy";

      await driver.save();

      order.order_status =
        "out_for_delivery";

      await order.save();

      res.json({
        message:
          "Driver assigned",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };