import { Op } from "sequelize";
import sequelize from "../database/db.js";
import Customer from "../models/customer.js";
import Subscription from "../models/subscriptions.js";
import SubscriptionDeliveryDay from "../models/Subscription_delivery_days.js";
import SubscriptionMealTime from "../models/Subscription_meal_times.js";
import SubscriptionPause from "../models/subscription_pauses.js";
import Refund from "../models/Refunds.js";
import DailyMealChoice from "../models/Daily_meal_choices.js";
import Coupon from "../models/Coupon.js";
import Notification from "../models/Notification.js";
import { checkCouponEligibility, calculateDiscount } from "../utils/couponHelper.js";

const toISODate = (date) => date.toISOString().split("T")[0];

const addDays = (isoDate, days) => {
  const d = new Date(isoDate);
  d.setDate(d.getDate() + days);
  return toISODate(d);
};

const daysBetween = (a, b) => Math.floor((b - a) / (1000 * 60 * 60 * 24));

const SUBSCRIPTION_INCLUDE = [
  { model: SubscriptionDeliveryDay },
  { model: SubscriptionMealTime },
];

export const createSubscription = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      restaurantRefId,
      restaurantName,
      restaurantImage,
      planId,
      planName,
      planPrice,
      mealsPerDay,
      duration,
      mealTimes,
      mealTimeSlots,
      deliveryDays,
      startDate,
      paymentMethod,
      couponCode,
    } = req.body;

    if (
      !restaurantRefId ||
      !restaurantName ||
      !planId ||
      !planName ||
      !planPrice ||
      !mealsPerDay ||
      !duration ||
      !Array.isArray(mealTimes) ||
      mealTimes.length === 0 ||
      !Array.isArray(deliveryDays) ||
      deliveryDays.length === 0 ||
      !startDate ||
      !paymentMethod
    ) {
      await transaction.rollback();
      return res.status(400).json({ message: "Missing required subscription details" });
    }

    const validMethods = ["khqr", "card"];
    if (!validMethods.includes(paymentMethod)) {
      await transaction.rollback();
      return res.status(400).json({ message: "Invalid payment method" });
    }

    const customer = await Customer.findOne({
      where: { user_id: req.user.id },
      transaction,
    });

    if (!customer) {
      await transaction.rollback();
      return res.status(404).json({ message: "Customer not found" });
    }

    const existingSubscription = await Subscription.findOne({
      where: {
        customer_id: customer.customer_id,
        status: { [Op.in]: ["active", "paused"] },
      },
      transaction,
    });

    if (existingSubscription) {
      await transaction.rollback();
      return res.status(409).json({
        message: "You already have an active subscription. Cancel it before subscribing to a new plan.",
      });
    }

    let discount_amount = 0;
    let appliedCouponCode = null;

    if (couponCode) {
      const coupon = await Coupon.findOne({
        where: { code: couponCode },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      const eligibilityError = checkCouponEligibility(coupon, Number(planPrice));

      if (eligibilityError) {
        await transaction.rollback();
        return res.status(400).json({ message: eligibilityError });
      }

      discount_amount = calculateDiscount(coupon, Number(planPrice));
      appliedCouponCode = coupon.code;

      await coupon.increment("used_count", { by: 1, transaction });
    }

    const total_amount = Math.max(Number(planPrice) - discount_amount, 0);
    const end_date = addDays(startDate, Number(duration) - 1);

    const subscription = await Subscription.create(
      {
        customer_id: customer.customer_id,
        restaurant_ref_id: restaurantRefId,
        restaurant_name: restaurantName,
        restaurant_image: restaurantImage,
        plan_id: planId,
        plan_name: planName,
        plan_price: planPrice,
        meals_per_day: mealsPerDay,
        duration_days: duration,
        start_date: startDate,
        end_date,
        discount_amount,
        coupon_code: appliedCouponCode,
        total_amount,
        payment_method: paymentMethod,
        payment_status: "paid",
        status: "active",
      },
      { transaction }
    );

    await SubscriptionDeliveryDay.bulkCreate(
      deliveryDays.map((day_name) => ({
        subscription_id: subscription.subscription_id,
        day_name,
      })),
      { transaction }
    );

    const timeByLabel = Object.fromEntries(
      (Array.isArray(mealTimeSlots) ? mealTimeSlots : []).map((slot) => [slot.label, slot.time])
    );

    await SubscriptionMealTime.bulkCreate(
      mealTimes.map((meal_time) => ({
        subscription_id: subscription.subscription_id,
        meal_time,
        delivery_time: timeByLabel[meal_time] || null,
      })),
      { transaction }
    );

    await transaction.commit();

    await Notification.create({
      user_id: req.user.id,
      type: "subscription",
      title: "Subscription Activated",
      message: `Your ${planName} subscription with ${restaurantName} is now active.`,
    });

    const created = await Subscription.findByPk(subscription.subscription_id, {
      include: SUBSCRIPTION_INCLUDE,
    });

    return res.status(201).json({
      message: "Subscription created successfully",
      subscription: created,
    });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getActiveSubscription = async (req, res) => {
  try {
    const customer = await Customer.findOne({ where: { user_id: req.user.id } });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const subscription = await Subscription.findOne({
      where: {
        customer_id: customer.customer_id,
        status: { [Op.in]: ["active", "paused"] },
      },
      include: SUBSCRIPTION_INCLUDE,
      order: [["created_at", "DESC"]],
    });

    if (!subscription) {
      return res.status(404).json({ message: "No active subscription" });
    }

    return res.status(200).json({ subscription });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getSubscriptionById = async (req, res) => {
  try {
    const { subscription_id } = req.params;

    const customer = await Customer.findOne({ where: { user_id: req.user.id } });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const subscription = await Subscription.findOne({
      where: { subscription_id, customer_id: customer.customer_id },
      include: SUBSCRIPTION_INCLUDE,
    });

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    return res.status(200).json({ subscription });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const pauseSubscription = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { subscription_id } = req.params;
    const { durationDays } = req.body;

    if (!durationDays || Number(durationDays) <= 0) {
      await transaction.rollback();
      return res.status(400).json({ message: "durationDays must be greater than 0" });
    }

    const customer = await Customer.findOne({
      where: { user_id: req.user.id },
      transaction,
    });

    if (!customer) {
      await transaction.rollback();
      return res.status(404).json({ message: "Customer not found" });
    }

    const subscription = await Subscription.findOne({
      where: { subscription_id, customer_id: customer.customer_id },
      transaction,
    });

    if (!subscription) {
      await transaction.rollback();
      return res.status(404).json({ message: "Subscription not found" });
    }

    if (subscription.status !== "active") {
      await transaction.rollback();
      return res.status(400).json({ message: "Only an active subscription can be paused" });
    }

    const pause_start = toISODate(new Date());
    const pause_resume = addDays(pause_start, Number(durationDays));
    const new_end_date = addDays(subscription.end_date, Number(durationDays));

    await subscription.update(
      {
        status: "paused",
        pause_start,
        pause_resume,
        end_date: new_end_date,
      },
      { transaction }
    );

    await SubscriptionPause.create(
      {
        subscription_id: subscription.subscription_id,
        pause_start,
        pause_resume,
        duration_days: durationDays,
        status: "active",
      },
      { transaction }
    );

    await transaction.commit();

    return res.status(200).json({ message: "Subscription paused", subscription });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const resumeSubscription = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { subscription_id } = req.params;

    const customer = await Customer.findOne({
      where: { user_id: req.user.id },
      transaction,
    });

    if (!customer) {
      await transaction.rollback();
      return res.status(404).json({ message: "Customer not found" });
    }

    const subscription = await Subscription.findOne({
      where: { subscription_id, customer_id: customer.customer_id },
      transaction,
    });

    if (!subscription) {
      await transaction.rollback();
      return res.status(404).json({ message: "Subscription not found" });
    }

    if (subscription.status !== "paused") {
      await transaction.rollback();
      return res.status(400).json({ message: "Only a paused subscription can be resumed" });
    }

    await subscription.update(
      { status: "active", pause_start: null, pause_resume: null },
      { transaction }
    );

    const openPause = await SubscriptionPause.findOne({
      where: { subscription_id: subscription.subscription_id, status: "active" },
      order: [["created_at", "DESC"]],
      transaction,
    });

    if (openPause) {
      await openPause.update({ status: "completed" }, { transaction });
    }

    await transaction.commit();

    return res.status(200).json({ message: "Subscription resumed", subscription });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const cancelSubscription = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { subscription_id } = req.params;
    const { reason } = req.body;

    const customer = await Customer.findOne({
      where: { user_id: req.user.id },
      transaction,
    });

    if (!customer) {
      await transaction.rollback();
      return res.status(404).json({ message: "Customer not found" });
    }

    const subscription = await Subscription.findOne({
      where: { subscription_id, customer_id: customer.customer_id },
      transaction,
    });

    if (!subscription) {
      await transaction.rollback();
      return res.status(404).json({ message: "Subscription not found" });
    }

    if (subscription.status === "cancelled") {
      await transaction.rollback();
      return res.status(400).json({ message: "Subscription is already cancelled" });
    }

    const today = new Date();
    const start = new Date(subscription.start_date);
    const elapsed = Math.min(
      Math.max(daysBetween(start, today) + 1, 0),
      subscription.duration_days
    );
    const totalMeals = subscription.duration_days * subscription.meals_per_day;
    const remainingMeals = Math.max(totalMeals - elapsed * subscription.meals_per_day, 0);
    const mealValue = Number(subscription.plan_price) / totalMeals;
    const estimatedValue = mealValue * remainingMeals;
    const refundAmount = estimatedValue * 0.6;

    await subscription.update(
      { status: "cancelled", cancelled_at: new Date(), payment_status: "refunded" },
      { transaction }
    );

    const refund = await Refund.create(
      {
        subscription_id: subscription.subscription_id,
        customer_id: customer.customer_id,
        remaining_meals: remainingMeals,
        meal_value: mealValue,
        estimated_value: estimatedValue,
        refund_amount: refundAmount,
        reason,
        status: "approved",
      },
      { transaction }
    );

    await transaction.commit();

    await Notification.create({
      user_id: req.user.id,
      type: "subscription",
      title: "Subscription Cancelled",
      message: `Your subscription has been cancelled. Estimated refund: $${refundAmount.toFixed(2)}.`,
    });

    return res.status(200).json({ message: "Subscription cancelled", refund });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getRefund = async (req, res) => {
  try {
    const { subscription_id } = req.params;

    const customer = await Customer.findOne({ where: { user_id: req.user.id } });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const refund = await Refund.findOne({
      where: { subscription_id, customer_id: customer.customer_id },
      order: [["created_at", "DESC"]],
    });

    if (!refund) {
      return res.status(404).json({ message: "Refund not found" });
    }

    return res.status(200).json({ refund });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const updateMealSchedule = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { subscription_id } = req.params;
    const { mealTimeSlots, deliveryDays } = req.body;

    const customer = await Customer.findOne({
      where: { user_id: req.user.id },
      transaction,
    });

    if (!customer) {
      await transaction.rollback();
      return res.status(404).json({ message: "Customer not found" });
    }

    const subscription = await Subscription.findOne({
      where: { subscription_id, customer_id: customer.customer_id },
      transaction,
    });

    if (!subscription) {
      await transaction.rollback();
      return res.status(404).json({ message: "Subscription not found" });
    }

    if (Array.isArray(mealTimeSlots)) {
      for (const slot of mealTimeSlots) {
        await SubscriptionMealTime.update(
          { delivery_time: slot.time || null },
          { where: { subscription_id, meal_time: slot.label }, transaction }
        );
      }
    }

    if (Array.isArray(deliveryDays) && deliveryDays.length > 0) {
      await SubscriptionDeliveryDay.destroy({ where: { subscription_id }, transaction });
      await SubscriptionDeliveryDay.bulkCreate(
        deliveryDays.map((day_name) => ({ subscription_id, day_name })),
        { transaction }
      );
    }

    await transaction.commit();

    const updated = await Subscription.findByPk(subscription_id, {
      include: SUBSCRIPTION_INCLUDE,
    });

    return res.status(200).json({ message: "Delivery schedule updated", subscription: updated });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

const resolveOwnedSubscription = async (req, transaction) => {
  const { subscription_id } = req.params;

  const customer = await Customer.findOne({
    where: { user_id: req.user.id },
    transaction,
  });

  if (!customer) return { error: { status: 404, message: "Customer not found" } };

  const subscription = await Subscription.findOne({
    where: { subscription_id, customer_id: customer.customer_id },
    transaction,
  });

  if (!subscription) return { error: { status: 404, message: "Subscription not found" } };

  return { customer, subscription };
};

export const saveMealChoice = async (req, res) => {
  try {
    const { date } = req.params;
    const { lunch, dinner, supper, breakfast } = req.body;

    const { customer, subscription, error } = await resolveOwnedSubscription(req);
    if (error) return res.status(error.status).json({ message: error.message });

    const [choice] = await DailyMealChoice.findOrCreate({
      where: { subscription_id: subscription.subscription_id, choice_date: date },
      defaults: {
        customer_id: customer.customer_id,
        lunch_item_id: lunch,
        dinner_item_id: dinner,
        supper_item_id: supper,
        breakfast_item_id: breakfast,
      },
    });

    await choice.update({
      lunch_item_id: lunch,
      dinner_item_id: dinner,
      supper_item_id: supper,
      breakfast_item_id: breakfast,
    });

    return res.status(200).json({ message: "Meal choice saved", choice });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getMealChoice = async (req, res) => {
  try {
    const { date } = req.params;

    const { subscription, error } = await resolveOwnedSubscription(req);
    if (error) return res.status(error.status).json({ message: error.message });

    const choice = await DailyMealChoice.findOne({
      where: { subscription_id: subscription.subscription_id, choice_date: date },
    });

    if (!choice) {
      return res.status(404).json({ message: "No meal choice saved for this date" });
    }

    return res.status(200).json({ choice });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

export const getMealChoicesRange = async (req, res) => {
  try {
    const { subscription, error } = await resolveOwnedSubscription(req);
    if (error) return res.status(error.status).json({ message: error.message });

    const choices = await DailyMealChoice.findAll({
      where: { subscription_id: subscription.subscription_id },
      order: [["choice_date", "ASC"]],
    });

    return res.status(200).json({ choices });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
