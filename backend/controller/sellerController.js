import { Op } from "sequelize";
import User from "../models/user.js";
import {
  Restaurant,
  Product,
  Category,
  Order,
  OrderItem,
  Customer,
  Driver,
  Delivery,
  Promotion,
  Review,
} from "../models/associations.js";

export const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await User.findAll({
      where: { role: "restaurant_owner" },
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
          attributes: ["full_name", "email"],
        },
      ],
    });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resolveRestaurant = async (req) => {
  return Restaurant.findOne({ where: { user_id: req.user.id } });
};

const notFoundRestaurant = (res) =>
  res.status(404).json({
    success: false,
    message: "No restaurant profile found for this account",
  });

/* ========================= */
/* PROFILE / SETTINGS        */
/* ========================= */

export const getProfile = async (req, res) => {
  try {
    const restaurant = await resolveRestaurant(req);
    if (!restaurant) return notFoundRestaurant(res);

    res.status(200).json({ success: true, data: restaurant });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const restaurant = await resolveRestaurant(req);
    if (!restaurant) return notFoundRestaurant(res);

    const { restaurant_name, phone, address } = req.body;

    await restaurant.update({
      ...(restaurant_name !== undefined && { restaurant_name }),
      ...(phone !== undefined && { phone }),
      ...(address !== undefined && { address }),
    });

    res.status(200).json({ success: true, data: restaurant });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const restaurant = await resolveRestaurant(req);
    if (!restaurant) return notFoundRestaurant(res);

    const { accepting_orders, auto_accept, sound_alerts } = req.body;

    await restaurant.update({
      ...(accepting_orders !== undefined && { accepting_orders }),
      ...(auto_accept !== undefined && { auto_accept }),
      ...(sound_alerts !== undefined && { sound_alerts }),
    });

    res.status(200).json({ success: true, data: restaurant });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ========================= */
/* MENU                      */
/* ========================= */

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({ order: [["category_name", "ASC"]] });
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const restaurant = await resolveRestaurant(req);
    if (!restaurant) return notFoundRestaurant(res);

    const products = await Product.findAll({
      where: { restaurant_id: restaurant.restaurant_id },
      include: [Category],
      order: [["created_at", "DESC"]],
    });

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const restaurant = await resolveRestaurant(req);
    if (!restaurant) return notFoundRestaurant(res);

    const { product_name, description, price, category_id } = req.body;

    if (!product_name || price === undefined || !category_id) {
      return res.status(400).json({
        message: "product_name, price and category_id are required",
      });
    }

    const product = await Product.create({
      restaurant_id: restaurant.restaurant_id,
      product_name,
      description: description || "",
      price,
      category_id,
      status: "available",
      ...(req.file && { image: req.file.filename }),
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const restaurant = await resolveRestaurant(req);
    if (!restaurant) return notFoundRestaurant(res);

    const product = await Product.findOne({
      where: {
        product_id: req.params.id,
        restaurant_id: restaurant.restaurant_id,
      },
    });

    if (!product) return res.status(404).json({ message: "Product not found" });

    const { product_name, description, price, category_id } = req.body;

    await product.update({
      ...(product_name !== undefined && { product_name }),
      ...(description !== undefined && { description }),
      ...(price !== undefined && { price }),
      ...(category_id !== undefined && { category_id }),
      ...(req.file && { image: req.file.filename }),
    });

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleProductStatus = async (req, res) => {
  try {
    const restaurant = await resolveRestaurant(req);
    if (!restaurant) return notFoundRestaurant(res);

    const product = await Product.findOne({
      where: {
        product_id: req.params.id,
        restaurant_id: restaurant.restaurant_id,
      },
    });

    if (!product) return res.status(404).json({ message: "Product not found" });

    product.status = product.status === "available" ? "unavailable" : "available";
    await product.save();

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const restockProduct = async (req, res) => {
  try {
    const restaurant = await resolveRestaurant(req);
    if (!restaurant) return notFoundRestaurant(res);

    const product = await Product.findOne({
      where: {
        product_id: req.params.id,
        restaurant_id: restaurant.restaurant_id,
      },
    });

    if (!product) return res.status(404).json({ message: "Product not found" });

    const amount = Number(req.body.amount) || 10;
    await product.increment("stock", { by: amount });
    await product.reload();

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const restaurant = await resolveRestaurant(req);
    if (!restaurant) return notFoundRestaurant(res);

    const product = await Product.findOne({
      where: {
        product_id: req.params.id,
        restaurant_id: restaurant.restaurant_id,
      },
    });

    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.destroy();

    res.status(200).json({ success: true, message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ========================= */
/* REVIEWS                   */
/* ========================= */

export const getRestaurantReviews = async (req, res) => {
  try {
    const restaurant = await resolveRestaurant(req);
    if (!restaurant) return notFoundRestaurant(res);

    const products = await Product.findAll({
      where: { restaurant_id: restaurant.restaurant_id },
      attributes: ["product_id"],
    });

    const productIds = products.map((p) => p.product_id);

    if (productIds.length === 0) {
      return res.status(200).json({
        success: true,
        total_reviews: 0,
        average_rating: "0.0",
        data: [],
      });
    }

    const reviews = await Review.findAll({
      where: { product_id: productIds },
      include: [
        {
          model: Customer,
          attributes: [],
          include: [{ model: User, attributes: ["full_name"] }],
        },
        {
          model: Product,
          attributes: ["product_name"],
        },
      ],
      order: [["review_date", "DESC"]],
    });

    const average_rating =
      reviews.length > 0
        ? (
            reviews.reduce((sum, review) => sum + review.rating, 0) /
            reviews.length
          ).toFixed(1)
        : "0.0";

    res.status(200).json({
      success: true,
      total_reviews: reviews.length,
      average_rating,
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ========================= */
/* ORDERS                    */
/* ========================= */

const ORDER_INCLUDES = [
  Customer,
  { model: OrderItem, include: [Product] },
];

export const getOrders = async (req, res) => {
  try {
    const restaurant = await resolveRestaurant(req);
    if (!restaurant) return notFoundRestaurant(res);

    const { status } = req.query;

    const orders = await Order.findAll({
      where: {
        restaurant_id: restaurant.restaurant_id,
        ...(status && { order_status: status }),
      },
      include: ORDER_INCLUDES,
      order: [["order_date", "DESC"]],
    });

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const findOwnedOrder = async (req) => {
  const restaurant = await resolveRestaurant(req);
  if (!restaurant) return { restaurant: null, order: null };

  const order = await Order.findOne({
    where: {
      order_id: req.params.id,
      restaurant_id: restaurant.restaurant_id,
    },
    include: ORDER_INCLUDES,
  });

  return { restaurant, order };
};

export const acceptOrder = async (req, res) => {
  try {
    const { restaurant, order } = await findOwnedOrder(req);
    if (!restaurant) return notFoundRestaurant(res);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.order_status !== "pending") {
      return res.status(409).json({ message: `Cannot accept an order that is ${order.order_status}` });
    }

    order.order_status = "accepted";
    await order.save();

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const prepareOrder = async (req, res) => {
  try {
    const { restaurant, order } = await findOwnedOrder(req);
    if (!restaurant) return notFoundRestaurant(res);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.order_status !== "accepted") {
      return res.status(409).json({ message: `Cannot prepare an order that is ${order.order_status}` });
    }

    order.order_status = "preparing";
    await order.save();

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendForDelivery = async (req, res) => {
  try {
    const { restaurant, order } = await findOwnedOrder(req);
    if (!restaurant) return notFoundRestaurant(res);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.order_status !== "preparing") {
      return res.status(409).json({ message: `Cannot dispatch an order that is ${order.order_status}` });
    }

    const driver = await Driver.findOne({ where: { current_status: "available" } });
    if (!driver) {
      return res.status(400).json({ message: "No available drivers right now" });
    }

    await Delivery.create({
      order_id: order.order_id,
      driver_id: driver.driver_id,
      delivery_status: "assigned",
    });

    driver.current_status = "busy";
    await driver.save();

    order.order_status = "out_for_delivery";
    await order.save();

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { restaurant, order } = await findOwnedOrder(req);
    if (!restaurant) return notFoundRestaurant(res);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (!["pending", "accepted", "preparing"].includes(order.order_status)) {
      return res.status(409).json({ message: `Cannot cancel an order that is ${order.order_status}` });
    }

    order.order_status = "cancelled";
    await order.save();

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ========================= */
/* DASHBOARD                 */
/* ========================= */

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

export const getDashboardMetrics = async (req, res) => {
  try {
    const restaurant = await resolveRestaurant(req);
    if (!restaurant) return notFoundRestaurant(res);

    const todayStart = startOfToday();
    const where = {
      restaurant_id: restaurant.restaurant_id,
      order_date: { [Op.gte]: todayStart },
    };

    const todayOrders = await Order.findAll({ where });

    const todayRevenue = todayOrders
      .filter((o) => o.order_status !== "cancelled")
      .reduce((sum, o) => sum + Number(o.total_amount), 0);

    const activeQueue = todayOrders.filter((o) =>
      ["pending", "accepted", "preparing"].includes(o.order_status)
    ).length;

    const pendingCount = todayOrders.filter((o) => o.order_status === "pending").length;

    res.status(200).json({
      success: true,
      data: {
        todayRevenue,
        todayOrdersCount: todayOrders.length,
        activeQueue,
        pendingCount,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRevenueChart = async (req, res) => {
  try {
    const restaurant = await resolveRestaurant(req);
    if (!restaurant) return notFoundRestaurant(res);

    const todayStart = startOfToday();

    const orders = await Order.findAll({
      where: {
        restaurant_id: restaurant.restaurant_id,
        order_date: { [Op.gte]: todayStart },
        order_status: { [Op.ne]: "cancelled" },
      },
    });

    const hourly = Array.from({ length: 16 }, (_, i) => {
      const hour = i + 7; // 07:00 - 22:00
      return { hour: `${String(hour).padStart(2, "0")}:00`, sales: 0 };
    });

    orders.forEach((order) => {
      const hour = new Date(order.order_date).getHours();
      const bucket = hourly.find((h) => Number(h.hour.slice(0, 2)) === hour);
      if (bucket) bucket.sales += Number(order.total_amount);
    });

    res.status(200).json({ success: true, data: hourly });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrdersStream = async (req, res) => {
  try {
    const restaurant = await resolveRestaurant(req);
    if (!restaurant) return notFoundRestaurant(res);

    const orders = await Order.findAll({
      where: { restaurant_id: restaurant.restaurant_id },
      include: [{ model: OrderItem, include: [Product] }],
      order: [["order_date", "DESC"]],
      limit: 5,
    });

    const data = orders.map((order) => ({
      id: order.order_id,
      status: order.order_status,
      total: Number(order.total_amount),
      order_date: order.order_date,
      items: order.OrderItems.map(
        (item) => `${item.quantity}x ${item.Product?.product_name ?? "Item"}`
      ).join(", "),
    }));

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ========================= */
/* ANALYTICS                 */
/* ========================= */

const pctChange = (current, previous) => {
  if (previous === 0) return current === 0 ? 0 : 100;
  return Number((((current - previous) / previous) * 100).toFixed(1));
};

export const getAnalyticsSummary = async (req, res) => {
  try {
    const restaurant = await resolveRestaurant(req);
    if (!restaurant) return notFoundRestaurant(res);

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [thisMonthOrders, lastMonthOrders] = await Promise.all([
      Order.findAll({
        where: {
          restaurant_id: restaurant.restaurant_id,
          order_date: { [Op.gte]: monthStart },
          order_status: { [Op.ne]: "cancelled" },
        },
      }),
      Order.findAll({
        where: {
          restaurant_id: restaurant.restaurant_id,
          order_date: { [Op.gte]: lastMonthStart, [Op.lt]: monthStart },
          order_status: { [Op.ne]: "cancelled" },
        },
      }),
    ]);

    const sum = (orders) => orders.reduce((s, o) => s + Number(o.total_amount), 0);

    const totalRevenue = sum(thisMonthOrders);
    const lastRevenue = sum(lastMonthOrders);
    const totalOrders = thisMonthOrders.length;
    const lastOrders = lastMonthOrders.length;
    const avgBasket = totalOrders ? totalRevenue / totalOrders : 0;
    const lastAvgBasket = lastOrders ? lastRevenue / lastOrders : 0;

    const thisMonthCustomerIds = [...new Set(thisMonthOrders.map((o) => o.customer_id))];
    let repeatCustomers = 0;

    if (thisMonthCustomerIds.length) {
      const priorOrders = await Order.findAll({
        where: {
          restaurant_id: restaurant.restaurant_id,
          customer_id: thisMonthCustomerIds,
          order_date: { [Op.lt]: monthStart },
        },
        attributes: ["customer_id"],
        group: ["customer_id"],
      });
      repeatCustomers = priorOrders.length;
    }

    const retentionRate = thisMonthCustomerIds.length
      ? Number(((repeatCustomers / thisMonthCustomerIds.length) * 100).toFixed(1))
      : 0;

    res.status(200).json({
      success: true,
      data: {
        totalRevenue,
        revenueChangePct: pctChange(totalRevenue, lastRevenue),
        totalOrders,
        ordersChangePct: pctChange(totalOrders, lastOrders),
        avgBasket,
        avgBasketChangePct: pctChange(avgBasket, lastAvgBasket),
        retentionRate,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getVolumeTimeline = async (req, res) => {
  try {
    const restaurant = await resolveRestaurant(req);
    if (!restaurant) return notFoundRestaurant(res);

    const days = Math.min(Number(req.query.days) || 7, 30);
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - (days - 1));

    const orders = await Order.findAll({
      where: {
        restaurant_id: restaurant.restaurant_id,
        order_date: { [Op.gte]: start },
        order_status: { [Op.ne]: "cancelled" },
      },
    });

    const timeline = Array.from({ length: days }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return {
        date: d.toISOString().slice(0, 10),
        day: d.toLocaleDateString("en-US", { weekday: "short" }),
        revenue: 0,
      };
    });

    orders.forEach((order) => {
      const dateKey = new Date(order.order_date).toISOString().slice(0, 10);
      const bucket = timeline.find((t) => t.date === dateKey);
      if (bucket) bucket.revenue += Number(order.total_amount);
    });

    res.status(200).json({ success: true, data: timeline });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSalesMix = async (req, res) => {
  try {
    const restaurant = await resolveRestaurant(req);
    if (!restaurant) return notFoundRestaurant(res);

    const start = new Date();
    start.setDate(start.getDate() - 30);

    const items = await OrderItem.findAll({
      include: [
        { model: Product, where: { restaurant_id: restaurant.restaurant_id }, include: [Category] },
        { model: Order, attributes: [], where: { order_date: { [Op.gte]: start }, order_status: { [Op.ne]: "cancelled" } } },
      ],
    });

    const mixByCategory = {};
    items.forEach((item) => {
      const categoryName = item.Product?.Category?.category_name ?? "Uncategorized";
      mixByCategory[categoryName] = (mixByCategory[categoryName] || 0) + Number(item.subtotal);
    });

    const data = Object.entries(mixByCategory).map(([name, value]) => ({ name, value }));

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ========================= */
/* PROMOTIONS                */
/* ========================= */

const computePromoStatus = (promo) => {
  const today = new Date().toISOString().slice(0, 10);
  if (today < promo.start_date) return "Scheduled";
  if (today > promo.end_date) return "Expired";
  return "Active";
};

export const getPromotions = async (req, res) => {
  try {
    const restaurant = await resolveRestaurant(req);
    if (!restaurant) return notFoundRestaurant(res);

    const promotions = await Promotion.findAll({
      where: { restaurant_id: restaurant.restaurant_id },
      order: [["created_at", "DESC"]],
    });

    const data = promotions.map((promo) => ({
      ...promo.toJSON(),
      status: computePromoStatus(promo),
    }));

    const activeCampaigns = data.filter((p) => p.status === "Active").length;
    const totalRedemptions = data.reduce((sum, p) => sum + p.redemptions, 0);
    const avgDiscount = data.length
      ? Math.round(data.reduce((sum, p) => sum + p.discount_percent, 0) / data.length)
      : 0;

    res.status(200).json({
      success: true,
      data,
      summary: { activeCampaigns, totalRedemptions, avgDiscount },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPromotion = async (req, res) => {
  try {
    const restaurant = await resolveRestaurant(req);
    if (!restaurant) return notFoundRestaurant(res);

    const { name, code, discount_percent, start_date, end_date } = req.body;

    if (!name || !code || !start_date || !end_date) {
      return res.status(400).json({
        message: "name, code, start_date and end_date are required",
      });
    }

    const promotion = await Promotion.create({
      restaurant_id: restaurant.restaurant_id,
      name,
      code: code.toUpperCase(),
      discount_percent: discount_percent || 10,
      start_date,
      end_date,
      redemptions: 0,
    });

    res.status(201).json({
      success: true,
      data: { ...promotion.toJSON(), status: computePromoStatus(promotion) },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
