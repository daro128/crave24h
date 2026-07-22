import {
  Cart,
  CartItem,
  Product,
  Order,
  OrderItem,
  Payment,
} from "../models/associations.js";

export const createOrder = async (req, res) => {
  try {
    const {
      customer_id,
      delivery_address,
      payment_method,
    } = req.body;

    const cart = await Cart.findOne({
      where: { customer_id },
      include: [
        {
          model: CartItem,
          include: [Product],
        },
      ],
    });

    if (!cart || cart.CartItems.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    const restaurant_id =
      cart.CartItems[0].Product.restaurant_id;

    const total_amount =
      cart.CartItems.reduce(
        (sum, item) =>
          sum + Number(item.subtotal),
        0
      );

    const order = await Order.create({
      customer_id,
      restaurant_id,
      total_amount,
      delivery_address,
      order_status: "pending",
      payment_status: "pending",
    });

    const items = cart.CartItems.map((item) => ({
      order_id: order.order_id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.Product.price,
      subtotal: item.subtotal,
    }));

    await OrderItem.bulkCreate(items);

    await Payment.create({
      order_id: order.order_id,
      payment_method,
      amount: total_amount,
      payment_status:
        payment_method === "cash"
          ? "pending"
          : "paid",
    });

    await CartItem.destroy({
      where: {
        cart_id: cart.cart_id,
      },
    });

    return res.status(201).json(order);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getCustomerOrders = async (
  req,
  res
) => {
  try {
    const { customer_id } = req.params;

    const orders = await Order.findAll({
      where: { customer_id },
      order: [["order_date", "DESC"]],
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

