import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faClock } from "@fortawesome/free-solid-svg-icons";

import { updateMealSchedule } from "../../../service/subscriptionService";

const EditScheduleModal = ({ subscription, focusMealTime, onClose, onUpdated }) => {
  const mealTimes = subscription.mealTimes || [];
  const [times, setTimes] = useState(() =>
    mealTimes.reduce((acc, label) => {
      acc[label] = subscription.deliveryTimes?.[label] || "12:00";
      return acc;
    }, {})
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const focusedInputRef = useRef(null);

  useEffect(() => {
    focusedInputRef.current?.focus();
  }, []);

  const handleSave = async () => {
    setSubmitting(true);
    setError("");
    try {
      const mealTimeSlots = mealTimes.map((label) => ({ label, time: times[label] }));
      await updateMealSchedule(subscription.subscription_id, { mealTimeSlots });
      onUpdated?.();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update delivery time. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="animate-fade-in-scale bg-white rounded-3xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">Edit Delivery Time</h2>
          <button onClick={onClose} className="btn-press text-gray-400 hover:text-gray-600 cursor-pointer">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Set what time you'd like each meal delivered. Changes apply to future deliveries.
        </p>

        <div className="space-y-3 mb-4">
          {mealTimes.map((label) => {
            const isFocused = label === focusMealTime;
            return (
              <div
                key={label}
                className={`flex items-center justify-between p-3 rounded-2xl border transition-colors ${
                  isFocused ? "border-[#004953] bg-[#004953]/5" : "border-gray-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-[#004953]/10 text-[#004953] flex items-center justify-center">
                    <FontAwesomeIcon icon={faClock} />
                  </span>
                  <p className="font-semibold text-gray-800">{label}</p>
                </div>
                <input
                  ref={isFocused ? focusedInputRef : null}
                  type="time"
                  value={times[label]}
                  onChange={(e) => setTimes((prev) => ({ ...prev, [label]: e.target.value }))}
                  className="px-2 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-[#004953]"
                />
              </div>
            );
          })}
        </div>

        {error && <p className="text-xs text-red-500 mb-2 text-center">{error}</p>}

        <button
          onClick={handleSave}
          disabled={submitting}
          className="btn-press w-full py-3 rounded-xl bg-[#004953] text-white font-semibold hover:bg-[#003940] transition disabled:opacity-50 disabled:cursor-not-allowed mb-2"
        >
          {submitting ? "Saving…" : "Save Delivery Time"}
        </button>

        <button onClick={onClose} className="btn-press w-full py-2 text-sm font-semibold text-gray-400 hover:text-gray-600 transition">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditScheduleModal;
