import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldHalved, faCreditCard, faLock } from "@fortawesome/free-solid-svg-icons";

import Navbar from "../../components/userComponent/HomepageComponent/Navbar";
import Footer from "../../components/userComponent/HomepageComponent/Footer";
import SubscriptionSteps from "../../components/userComponent/MonthlyMealComponent/SubscriptionSteps";
import { getDraft, saveDraft } from "../../utils/subscriptionStorage";
import { PATH } from "../../path";

const DELIVERY_FEE = 10;

const PAYMENT_METHODS = [
  { id: "khqr", label: "KHQR (Bakong)", desc: "Pay instantly using any bank app in Cambodia", icon: faShieldHalved },
  { id: "card", label: "Credit or Debit Card", desc: "Visa, Mastercard, or UnionPay", icon: faCreditCard },
];

const MonthlySubscriptionPayment = () => {
  const navigate = useNavigate();
  const [draft] = useState(() => getDraft());
  const [method, setMethod] = useState("khqr");
  const [promo, setPromo] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState("");

  useEffect(() => {
    if (!draft?.planId) navigate(PATH.USER.MonthlyMeal);
  }, [draft, navigate]);

  if (!draft?.planId) return null;

  const subtotal = draft.planPrice - DELIVERY_FEE;
  const total = Math.max(draft.planPrice - discount, 0);

  const handleApplyPromo = () => {
    if (promo.trim().toUpperCase() === "CRAVE10") {
      setDiscount(10);
      setPromoMessage("Promo applied: -$10.00");
    } else {
      setDiscount(0);
      setPromoMessage("Invalid promo code");
    }
  };

  const handlePay = () => {
    saveDraft({
      paymentMethod: method,
      discount,
      total,
      couponCode: discount > 0 ? promo.trim().toUpperCase() : null,
    });
    navigate(PATH.USER.MonthlyMealDelivery);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-8 lg:px-15 py-5">
        <Navbar />

        <div className="mt-8 mb-8">
          <SubscriptionSteps currentStep={2} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <h1 className="text-2xl font-bold text-[#004953]">Select Payment Method</h1>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                <FontAwesomeIcon icon={faShieldHalved} /> Secure Payment
              </span>
            </div>

            <div className="space-y-3">
              {PAYMENT_METHODS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={`btn-press w-full flex items-center justify-between p-4 rounded-2xl border-2 bg-white text-left transition-colors cursor-pointer ${
                    method === m.id ? "border-[#004953] bg-[#004953]/5" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        method === m.id ? "border-[#004953]" : "border-gray-300"
                      }`}
                    >
                      {method === m.id && <span className="w-2.5 h-2.5 rounded-full bg-[#004953]" />}
                    </span>
                    <div>
                      <p className="font-semibold text-gray-800">{m.label}</p>
                      <p className="text-sm text-gray-400">{m.desc}</p>
                    </div>
                  </div>
                  <FontAwesomeIcon icon={m.icon} className="text-gray-400 text-lg" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: ORDER SUMMARY */}
          <div>
            <div className="bg-white rounded-3xl shadow-md p-6 sticky top-24">
              <h3 className="text-lg font-bold text-[#004953] mb-1">Order Summary</h3>
              <p className="text-sm font-semibold text-gray-700 mb-4">{draft.restaurantName}</p>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Plan Type</span>
                  <span className="font-semibold text-gray-800">{draft.planName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Duration</span>
                  <span className="font-semibold text-gray-800">{draft.duration} Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-semibold text-gray-800">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Delivery Fee</span>
                  <span className="font-semibold text-gray-800">${DELIVERY_FEE.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Discount</span>
                    <span className="font-semibold text-green-600">-${discount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between items-baseline">
                <span className="text-gray-500 text-sm">Total</span>
                <span className="text-2xl font-bold text-[#004953]">${total.toFixed(2)}</span>
              </div>

              <button
                onClick={handlePay}
                className="btn-press w-full mt-5 py-3.5 rounded-xl bg-[#004953] text-white font-semibold hover:bg-[#003940] transition"
              >
                Pay ${total.toFixed(2)}
              </button>

              <p className="mt-3 text-center text-gray-400 flex items-center justify-center gap-2 text-xs">
                <FontAwesomeIcon icon={faLock} /> Encrypted transaction
              </p>

              <div className="mt-5 flex gap-2">
                <input
                  type="text"
                  placeholder="Promo Code"
                  value={promo}
                  onChange={(e) => setPromo(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#004953]"
                />
                <button
                  onClick={handleApplyPromo}
                  className="btn-press px-4 py-2 rounded-lg bg-gray-100 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition"
                >
                  Apply
                </button>
              </div>
              {promoMessage && (
                <p className={`mt-2 text-xs ${discount > 0 ? "text-green-600" : "text-red-500"}`}>{promoMessage}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-15">
        <Footer />
      </div>
    </div>
  );
};

export default MonthlySubscriptionPayment;
