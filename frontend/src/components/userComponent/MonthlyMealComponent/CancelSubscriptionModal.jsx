import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faCircleInfo, faBan } from "@fortawesome/free-solid-svg-icons";

import { cancelSubscription } from "../../../service/subscriptionService";
import { PATH } from "../../../path";

const REASONS = ["Moving away", "Too expensive", "Dietary changes", "Ordering less often"];

const CancelSubscriptionModal = ({ subscription, remainingMeals, onClose, onCancelled }) => {
  const navigate = useNavigate();
  const [reason, setReason] = useState(REASONS[0]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const mealValue = subscription.planPrice / (subscription.duration * subscription.mealsPerDay);
  const estimatedValue = mealValue * remainingMeals;
  const refundable = estimatedValue * 0.6;

  const handleCancel = async () => {
    setSubmitting(true);
    setError("");
    try {
      await cancelSubscription(subscription.subscription_id, { reason });
      onCancelled?.();
      navigate(PATH.USER.MonthlyMeal);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to cancel subscription. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePauseInstead = () => {
    onClose?.();
    navigate(PATH.USER.PauseSubscription);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="animate-fade-in-scale bg-white rounded-3xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">Cancel Subscription?</h2>
          <button onClick={onClose} className="btn-press text-gray-400 hover:text-gray-600 cursor-pointer">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="bg-blue-50 text-blue-700 text-xs rounded-xl px-4 py-3 flex items-start gap-2 mb-4">
          <FontAwesomeIcon icon={faCircleInfo} className="mt-0.5" />
          <span>
            You have {remainingMeals} meals remaining. Estimated value: ${estimatedValue.toFixed(2)}
          </span>
        </div>

        <div className="bg-gray-50 rounded-2xl p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-700">Refund Summary</span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500">Refundable Amount</span>
            <span className="font-bold text-[#004953]">${refundable.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500">Refund Method</span>
            <span className="text-gray-700">KHQR / Original Payment</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Processing Time</span>
            <span className="text-gray-700">3-5 Business Days</span>
          </div>
        </div>

        <p className="text-sm font-semibold text-gray-700 mb-2">Reason for leaving</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {REASONS.map((r) => (
            <button
              key={r}
              onClick={() => setReason(r)}
              className={`btn-press px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                reason === r ? "bg-[#004953] text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="bg-emerald-50 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <p className="text-sm font-semibold text-emerald-700">Not at home for a while?</p>
            <p className="text-xs text-emerald-600">
              Pause instead — keep your remaining days for later. You can resume anytime without losing your balance.
            </p>
          </div>
          <button
            onClick={handlePauseInstead}
            className="btn-press shrink-0 px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition"
          >
            Pause Instead
          </button>
        </div>

        {error && <p className="text-xs text-red-500 mb-2 text-center">{error}</p>}

        <button
          onClick={handleCancel}
          disabled={submitting}
          className="btn-press w-full py-3 rounded-xl border-2 border-red-500 text-red-500 font-semibold hover:bg-red-50 transition flex items-center justify-center gap-2 mb-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FontAwesomeIcon icon={faBan} /> {submitting ? "Cancelling…" : "Cancel & Request Refund"}
        </button>

        <button onClick={onClose} className="btn-press w-full py-2 text-sm font-semibold text-gray-400 hover:text-gray-600 transition">
          Keep Subscription
        </button>
      </div>
    </div>
  );
};

export default CancelSubscriptionModal;
