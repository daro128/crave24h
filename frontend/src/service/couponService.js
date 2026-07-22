import API from "../Api/axios.js"

const STORAGE_KEY = "appliedCoupon";

export const validateCoupon = async (code, order_total) => {
  const res = await API.post("/coupons/validate", {
    code,
    order_total,
  });
  return res.data;
};

export const saveAppliedCoupon = (coupon) => {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(coupon));
};

export const clearAppliedCoupon = () => {
  sessionStorage.removeItem(STORAGE_KEY);
};

export const getAppliedCouponCode = () => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw).code : null;
  } catch {
    return null;
  }
};

// Re-checks a previously applied coupon against the current order total
// (cart contents can change between checkout steps), keeping the discount
// shown on every page consistent with what the backend will actually charge.
export const revalidateAppliedCoupon = async (order_total) => {
  const code = getAppliedCouponCode();

  if (!code) return null;

  try {
    const data = await validateCoupon(code, order_total);
    saveAppliedCoupon(data);
    return data;
  } catch {
    clearAppliedCoupon();
    return null;
  }
};
