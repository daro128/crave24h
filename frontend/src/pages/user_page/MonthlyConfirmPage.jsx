import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUtensils, faLayerGroup, faClock, faCalendarDays, faGift, faHeadset } from "@fortawesome/free-solid-svg-icons";

import Navbar from "../../components/userComponent/HomepageComponent/Navbar";
import Footer from "../../components/userComponent/HomepageComponent/Footer";
import SubscriptionSteps from "../../components/userComponent/MonthlyMealComponent/SubscriptionSteps";
import { getDraft, clearDraft } from "../../utils/subscriptionStorage";
import { createSubscription } from "../../service/subscriptionService";
import { PATH } from "../../path";

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });

const formatTime = (time24) => {
  if (!time24) return "";
  const [h, m] = time24.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
};

const addDays = (iso, days) => {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
};

const MonthlyConfirmPage = () => {
  const navigate = useNavigate();
  const [draft] = useState(() => getDraft());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!draft?.startDate) navigate(PATH.USER.MonthlyMeal);
  }, [draft, navigate]);

  if (!draft?.startDate) return null;

  const endDate = addDays(draft.startDate, draft.duration - 1);

  const handleConfirm = async () => {
    setSubmitting(true);
    setError("");
    try {
      await createSubscription({
        restaurantRefId: draft.restaurantId,
        restaurantName: draft.restaurantName,
        restaurantImage: draft.restaurantImage,
        planId: draft.planId,
        planName: draft.planName,
        planPrice: draft.planPrice,
        mealsPerDay: draft.mealsPerDay,
        duration: draft.duration,
        mealTimes: draft.mealTimes,
        mealTimeSlots: draft.mealTimeSlots,
        deliveryDays: draft.deliveryDays,
        startDate: draft.startDate,
        paymentMethod: draft.paymentMethod,
        couponCode: draft.couponCode,
      });
      clearDraft();
      navigate(PATH.USER.MonthlyMealActive);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to confirm subscription. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-8 lg:px-15 py-5">
        <Navbar />

        <div className="mt-8 mb-8">
          <SubscriptionSteps currentStep={4} />
        </div>

        <div className="max-w-4xl mx-auto text-center mb-6">
          <h1 className="text-2xl font-bold text-[#004953]">Review & Confirm</h1>
          <p className="text-gray-500 mt-1">Please review your subscription details.</p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-md p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
              <h3 className="font-bold text-gray-800">Subscription Details</h3>
              <span className="text-xs font-semibold text-[#004953] bg-[#004953]/10 px-3 py-1 rounded-full">
                {draft.duration}-day nourishment cycle
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-4 text-sm">
              <DetailRow icon={faUtensils} label="Restaurant" value={draft.restaurantName} />
              <DetailRow icon={faLayerGroup} label="Plan" value={draft.planName} />
              <DetailRow icon={faCalendarDays} label="Duration" value={`${draft.duration} Days`} />
              <DetailRow icon={faCalendarDays} label="Timeline" value={`${formatDate(draft.startDate)} — ${formatDate(endDate)}`} />
              <DetailRow
                icon={faClock}
                label="Meal Times"
                value={
                  draft.mealTimeSlots?.length
                    ? draft.mealTimeSlots.map((s) => `${s.label} (${formatTime(s.time)})`).join(", ")
                    : draft.mealTimes?.join(", ")
                }
              />
              <DetailRow icon={faCalendarDays} label="Delivery Days" value={draft.deliveryDays?.join(", ")} />
            </div>

            <div className="mt-5 bg-emerald-50 text-emerald-700 text-xs rounded-xl px-4 py-3">
              You can modify your meal choice daily before 9:00 PM for next-day delivery.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
              <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0">
                  <FontAwesomeIcon icon={faGift} className="text-[#004953]" />
                </span>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Gift a Healthy Habit</p>
                  <p className="text-xs text-gray-400">Send a 7-day meal plan to a friend.</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0">
                  <FontAwesomeIcon icon={faHeadset} className="text-[#004953]" />
                </span>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Need Help?</p>
                  <p className="text-xs text-gray-400">Our support team is ready to assist.</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-3xl shadow-md p-6 sticky top-24">
              <h3 className="text-lg font-bold text-[#004953] mb-4">Order Summary</h3>
              <div className="flex justify-between items-baseline mb-5">
                <span className="text-gray-500 text-sm">Total</span>
                <span className="text-2xl font-bold text-[#004953]">
                  ${(draft.total ?? draft.planPrice).toFixed(2)}
                </span>
              </div>

              {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

              <button
                onClick={handleConfirm}
                disabled={submitting}
                className="btn-press w-full py-3.5 rounded-xl bg-[#004953] text-white font-semibold hover:bg-[#003940] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Confirming…" : "Confirm Subscription"}
              </button>

              <button
                onClick={() => navigate(PATH.USER.MonthlyMealDelivery)}
                className="btn-press w-full mt-2 py-2.5 text-sm font-semibold text-gray-500 hover:text-[#004953] transition"
              >
                Back to Delivery Details
              </button>

              <p className="mt-3 text-center text-gray-400 text-xs">🔒 Secure Checkout · Encrypted transactions</p>
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

const DetailRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <span className="w-8 h-8 rounded-lg bg-gray-50 text-[#004953] flex items-center justify-center shrink-0">
      <FontAwesomeIcon icon={icon} className="text-xs" />
    </span>
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="font-semibold text-gray-800">{value || "—"}</p>
    </div>
  </div>
);

export default MonthlyConfirmPage;
