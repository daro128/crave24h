
export const checkCouponEligibility = (coupon, orderTotal) => {
  if (!coupon || !coupon.is_active) {
    return "Invalid coupon";
  }

  const now = new Date();

  if (coupon.start_date && now < coupon.start_date) {
    return "Coupon not started yet";
  }

  if (coupon.end_date && now > coupon.end_date) {
    return "Coupon expired";
  }

  if (orderTotal < Number(coupon.min_order)) {
    return `Minimum order is $${coupon.min_order}`;
  }

  if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
    return "Coupon fully used";
  }

  return null;
};

export const calculateDiscount = (coupon, orderTotal) => {
  let discount = 0;

  if (coupon.discount_type === "percent") {
    discount = (orderTotal * Number(coupon.discount_value)) / 100;
  } else {
    discount = Number(coupon.discount_value);
  }

  if (coupon.max_discount) {
    discount = Math.min(discount, Number(coupon.max_discount));
  }

  // Never discount more than the order itself
  discount = Math.min(discount, orderTotal);

  return Math.max(discount, 0);
};
