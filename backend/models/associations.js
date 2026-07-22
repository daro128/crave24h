import User from "./user.js";
import Customer from "./customer.js";
import Restaurant from "./Restaurant.js";
import Driver from "./Driver.js";
import Category from "./Category.js";
import Product from "./Product.js";
import Cart from "./Cart.js";
import CartItem from "./CartItem.js";
import Order from "./Order.js";
import OrderItem from "./OrderItem.js";
import Payment from "./Payment.js";
import Delivery from "./Delivery.js";
import Review from "./Review.js";
import Notification from "./Notification.js";
import Promotion from "./Promotion.js";
import FavouriteProduct from "./FavouriteProduct.js";
import FavouriteRestaurant from "./FavouriteRestaurant.js";
import Subscription from "./subscriptions.js";
import SubscriptionDeliveryDay from "./Subscription_delivery_days.js";
import SubscriptionMealTime from "./Subscription_meal_times.js";
import SubscriptionPause from "./subscription_pauses.js";
import Refund from "./Refunds.js";
import DailyMealChoice from "./Daily_meal_choices.js";

// user
User.hasOne(Customer, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});
Customer.belongsTo(User, {
  foreignKey: "user_id",
});

User.hasOne(Restaurant, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});
Restaurant.belongsTo(User, {
  foreignKey: "user_id",
});

User.hasOne(Driver, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});
Driver.belongsTo(User, {
  foreignKey: "user_id",
});

User.hasMany(Notification, {
  foreignKey: "user_id",
});
Notification.belongsTo(User, {
  foreignKey: "user_id",
});

//product

Restaurant.hasMany(Product, {
  foreignKey: "restaurant_id",
});
Product.belongsTo(Restaurant, {
  foreignKey: "restaurant_id",
});

Category.hasMany(Product, {
  foreignKey: "category_id",
});
Product.belongsTo(Category, {
  foreignKey: "category_id",
});
// card

Customer.hasOne(Cart, {
  foreignKey: "customer_id",
  onDelete: "CASCADE",
});
Cart.belongsTo(Customer, {
  foreignKey: "customer_id",
});

Cart.hasMany(CartItem, {
  foreignKey: "cart_id",
  onDelete: "CASCADE",
});
CartItem.belongsTo(Cart, {
  foreignKey: "cart_id",
});

Product.hasMany(CartItem, {
  foreignKey: "product_id",
});
CartItem.belongsTo(Product, {
  foreignKey: "product_id",
});

//Order

Customer.hasMany(Order, {
  foreignKey: "customer_id",
});
Order.belongsTo(Customer, {
  foreignKey: "customer_id",
});

Restaurant.hasMany(Order, {
  foreignKey: "restaurant_id",
});
Order.belongsTo(Restaurant, {
  foreignKey: "restaurant_id",
});

Order.hasMany(OrderItem, {
  foreignKey: "order_id",
  onDelete: "CASCADE",
});
OrderItem.belongsTo(Order, {
  foreignKey: "order_id",
});

Product.hasMany(OrderItem, {
  foreignKey: "product_id",
});
OrderItem.belongsTo(Product, {
  foreignKey: "product_id",
});

//payment

Order.hasOne(Payment, {
  foreignKey: "order_id",
  onDelete: "CASCADE",
});
Payment.belongsTo(Order, {
  foreignKey: "order_id",
});

//delivery
Order.hasOne(Delivery, {
  foreignKey: "order_id",
  onDelete: "CASCADE",
});
Delivery.belongsTo(Order, {
  foreignKey: "order_id",
});

Driver.hasMany(Delivery, {
  foreignKey: "driver_id",
});
Delivery.belongsTo(Driver, {
  foreignKey: "driver_id",
});

//review

Customer.hasMany(Review, {
  foreignKey: "customer_id",
});
Review.belongsTo(Customer, {
  foreignKey: "customer_id",
});

Product.hasMany(Review, {
  foreignKey: "product_id",
});
Review.belongsTo(Product, {
  foreignKey: "product_id",
});

//Restaurant and Category
Category.hasMany(Restaurant, {
  foreignKey: "category_id",
});

Restaurant.belongsTo(Category, {
  foreignKey: "category_id",
});

//promotions
Restaurant.hasMany(Promotion, {
  foreignKey: "restaurant_id",
  onDelete: "CASCADE",
});
Promotion.belongsTo(Restaurant, {
  foreignKey: "restaurant_id",
});

//Favourite Restaurants

Customer.hasMany(FavouriteRestaurant, {
  foreignKey: "customer_id",
});

FavouriteRestaurant.belongsTo(Customer, {
  foreignKey: "customer_id",
});

Restaurant.hasMany(FavouriteRestaurant, {
  foreignKey: "restaurant_id",
});

FavouriteRestaurant.belongsTo(Restaurant, {
  foreignKey: "restaurant_id",
});

// Favourite Products
Customer.hasMany(FavouriteProduct, {
  foreignKey: "customer_id",
});

FavouriteProduct.belongsTo(Customer, {
  foreignKey: "customer_id",
});

Product.hasMany(FavouriteProduct, {
  foreignKey: "product_id",
});

FavouriteProduct.belongsTo(Product, {
  foreignKey: "product_id",
});

// Subscriptions
Customer.hasMany(Subscription, {
  foreignKey: "customer_id",
});
Subscription.belongsTo(Customer, {
  foreignKey: "customer_id",
});

Subscription.hasMany(SubscriptionDeliveryDay, {
  foreignKey: "subscription_id",
  onDelete: "CASCADE",
});
SubscriptionDeliveryDay.belongsTo(Subscription, {
  foreignKey: "subscription_id",
});

Subscription.hasMany(SubscriptionMealTime, {
  foreignKey: "subscription_id",
  onDelete: "CASCADE",
});
SubscriptionMealTime.belongsTo(Subscription, {
  foreignKey: "subscription_id",
});

Subscription.hasMany(SubscriptionPause, {
  foreignKey: "subscription_id",
  onDelete: "CASCADE",
});
SubscriptionPause.belongsTo(Subscription, {
  foreignKey: "subscription_id",
});

Subscription.hasMany(Refund, {
  foreignKey: "subscription_id",
});
Refund.belongsTo(Subscription, {
  foreignKey: "subscription_id",
});

Subscription.hasMany(DailyMealChoice, {
  foreignKey: "subscription_id",
  onDelete: "CASCADE",
});
DailyMealChoice.belongsTo(Subscription, {
  foreignKey: "subscription_id",
});

export {
  User,
  Customer,
  Restaurant,
  Driver,
  Category,
  Product,
  Cart,
  CartItem,
  Order,
  OrderItem,
  Payment,
  Delivery,
  Review,
  Notification,
  Promotion,
  Subscription,
  SubscriptionDeliveryDay,
  SubscriptionMealTime,
  SubscriptionPause,
  Refund,
  DailyMealChoice,
};