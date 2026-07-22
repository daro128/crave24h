import Coupon from "../models/Coupon.js";
import { checkCouponEligibility, calculateDiscount } from "../utils/couponHelper.js";

export const validateCoupon = async (req, res) => {
  try {
    const { code, order_total } = req.body;

    if (!code || order_total === undefined || order_total === null) {
      return res.status(400).json({ message: "Code and order_total are required" });
    }

    const orderTotal = Number(order_total);

    const coupon = await Coupon.findOne({
      where: { code, is_active: true },
    });

    const eligibilityError = checkCouponEligibility(coupon, orderTotal);

    if (eligibilityError) {
      return res.status(coupon ? 400 : 404).json({ message: eligibilityError });
    }

    const discount = calculateDiscount(coupon, orderTotal);
    const final_total = Math.max(orderTotal - discount, 0);

    return res.json({
      valid: true,
      code: coupon.code,
      discount,
      final_total,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      discount_type,
      discount_value,
      min_order,
      max_discount,
      usage_limit,
      start_date,
      end_date,
    } = req.body;

    // check duplicate
    const existing = await Coupon.findOne({ where: { code } });

    if (existing) {
      return res.status(400).json({ message: "Coupon already exists" });
    }

    const coupon = await Coupon.create({
      code,
      discount_type,
      discount_value,
      min_order,
      max_discount,
      usage_limit,
      start_date,
      end_date,
      is_active: true,
    });

    return res.status(201).json({
      message: "Coupon created successfully",
      coupon,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

