import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../path";
import { getCart } from "../../../service/cartService";
import {
  validateCoupon,
  saveAppliedCoupon,
  clearAppliedCoupon,
  revalidateAppliedCoupon,
} from "../../../service/couponService";
import Loading from "../../../pages/user_page/LoadingPage";

const Rightsection = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [subtotal, setSubtotal] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);

  const [promoCode, setPromoCode] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const discount = appliedCoupon?.discount || 0;

  const loadCart = async () => {
    try {
      const res = await getCart();
      const cartSubtotal = Number(res.data.total) || 0;

      setSubtotal(cartSubtotal);
      setDeliveryFee(Number(res.data.deliveryFee) || 0);

      const restored = await revalidateAppliedCoupon(cartSubtotal);
      if (restored) {
        setAppliedCoupon(restored);
        setPromoCode(restored.code);
      }
    } catch (err) {
      console.log(err);

      if (err.response?.status === 404) {
        setSubtotal(0);
        setDeliveryFee(0);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleApplyCoupon = async () => {
    if (!promoCode.trim()) return;

    setApplyingCoupon(true);
    setCouponError("");

    try {
      const data = await validateCoupon(promoCode.trim(), subtotal);
      setAppliedCoupon(data);
      saveAppliedCoupon(data);
    } catch (err) {
      console.log(err);
      setAppliedCoupon(null);
      clearAppliedCoupon();
      setCouponError(err.response?.data?.message || "Invalid coupon");
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
    setPromoCode("");
    clearAppliedCoupon();
  };

  if (loading) {
    return <Loading />;
  }

  const isEmpty = subtotal === 0;
  const total = Math.max(subtotal + deliveryFee - discount, 0);

  return (
    <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl border p-6 h-fit sticky top-5">

      <h2 className="text-2xl font-bold text-[#004953] mb-6">
        Order Summary
      </h2>

      {/* Price */}
      <div className="space-y-3 text-gray-700">

        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span>Delivery Fee</span>
          <span>${deliveryFee.toFixed(2)}</span>
        </div>

        {appliedCoupon && (
          <div className="flex justify-between text-green-700">
            <span>Discount ({appliedCoupon.code})</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}

      </div>

      <hr className="my-6" />

      {/* Promo */}
      <div>
        <label className="font-semibold text-[#004953]">
          Promo Code
        </label>

        {appliedCoupon ? (
          <div className="flex items-center justify-between mt-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
            <span className="text-green-700 font-medium">
              "{appliedCoupon.code}" applied
            </span>
            <button
              onClick={handleRemoveCoupon}
              className="btn-press text-sm text-red-600 hover:underline"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3 mt-3">

            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Enter promo code"
              className="flex-1 min-w-0 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#004953]"
            />

            <button
              onClick={handleApplyCoupon}
              disabled={applyingCoupon || !promoCode.trim()}
              className="btn-press bg-[#004953] text-white px-5 py-3 sm:py-0 rounded-xl hover:bg-[#00353d] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {applyingCoupon ? "Applying..." : "Apply"}
            </button>

          </div>
        )}

        {couponError && (
          <p className="text-red-600 text-sm mt-2">{couponError}</p>
        )}
      </div>

      <hr className="my-6" />

      {/* Total */}

      <div className="flex justify-between text-xl font-bold">

        <span>Total</span>

        <span className="text-[#004953]">
          ${total.toFixed(2)}
        </span>

      </div>

      {/* ETA */}

      <div className="mt-6 bg-green-100 text-green-700 rounded-xl py-3 text-center font-medium">
        🚚 Estimated Arrival: 20–25 mins
      </div>

      {/* Checkout */}

      <button
        disabled={isEmpty}
        onClick={() => navigate(PATH.USER.AddAdress)}
        className={`btn-press w-full mt-6 py-4 rounded-2xl font-semibold transition-all
          ${
            isEmpty
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-[#004953] text-white hover:scale-[1.02] shadow-md hover:shadow-lg"
          }`}
      >
        {isEmpty ? "Your Cart Is Empty" : "Continue to Address"}
      </button>

    </div>
  );
};

export default Rightsection;