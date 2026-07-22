import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faXmark, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { submitReview } from "../../../service/reviewService";

const RateOrderModal = ({ order, onClose }) => {
  const items = order?.OrderItems || [];

  const [entries, setEntries] = useState(
    () =>
      Object.fromEntries(
        items.map((i) => [i.Product?.product_id ?? i.product_id, { rating: 0, comment: "" }])
      )
  );
  const [submittedIds, setSubmittedIds] = useState(new Set());
  const [failedIds, setFailedIds] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const setRating = (productId, rating) => {
    setEntries((prev) => ({ ...prev, [productId]: { ...prev[productId], rating } }));
  };

  const setComment = (productId, comment) => {
    setEntries((prev) => ({ ...prev, [productId]: { ...prev[productId], comment } }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const nextFailed = {};

    await Promise.all(
      items.map(async (item) => {
        const productId = item.Product?.product_id ?? item.product_id;
        if (submittedIds.has(productId)) return;

        const entry = entries[productId];
        if (!entry?.rating) return;

        try {
          await submitReview({
            product_id: productId,
            rating: entry.rating,
            comment: entry.comment,
          });
          setSubmittedIds((prev) => new Set(prev).add(productId));
        } catch (err) {
          nextFailed[productId] =
            err?.response?.data?.message || "Couldn't submit this review.";
        }
      })
    );

    setFailedIds(nextFailed);
    setSubmitting(false);
  };

  const allDone = items.length > 0 && items.every((i) => submittedIds.has(i.Product?.product_id ?? i.product_id));

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-xl p-6 animate-fade-in-scale max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-[#004953]">Rate your order</h2>
            <p className="text-xs text-gray-400 mt-0.5">Order #{order?.order_id}</p>
          </div>
          <button
            onClick={onClose}
            className="btn-press text-gray-400 hover:text-gray-600 transition"
          >
            <FontAwesomeIcon icon={faXmark} size="lg" />
          </button>
        </div>

        {allDone ? (
          <div className="flex flex-col items-center text-center py-8">
            <FontAwesomeIcon icon={faCircleCheck} className="text-green-500 text-4xl mb-3" />
            <p className="font-semibold text-gray-800">Thanks for your feedback!</p>
            <button
              onClick={onClose}
              className="btn-press mt-5 px-5 py-2 rounded-xl bg-[#004953] text-white text-sm font-semibold"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-5">
              {items.map((item) => {
                const productId = item.Product?.product_id ?? item.product_id;
                const entry = entries[productId] || { rating: 0, comment: "" };
                const done = submittedIds.has(productId);

                return (
                  <div
                    key={productId}
                    className={`rounded-2xl border p-4 transition ${
                      done ? "border-green-200 bg-green-50/40" : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-gray-800 text-sm truncate">
                        {item.Product?.product_name || "Item"}
                      </p>
                      {done && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-green-600 shrink-0">
                          <FontAwesomeIcon icon={faCircleCheck} /> Reviewed
                        </span>
                      )}
                    </div>

                    {!done && (
                      <>
                        <div className="flex items-center gap-1.5 mt-3">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRating(productId, star)}
                              className="btn-press cursor-pointer"
                            >
                              <FontAwesomeIcon
                                icon={faStar}
                                className={
                                  star <= entry.rating ? "text-amber-400" : "text-gray-200"
                                }
                              />
                            </button>
                          ))}
                        </div>

                        <textarea
                          rows={2}
                          placeholder="Share your thoughts (optional)"
                          value={entry.comment}
                          onChange={(e) => setComment(productId, e.target.value)}
                          className="w-full mt-3 px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#004953] resize-none"
                        />

                        {failedIds[productId] && (
                          <p className="text-xs text-red-500 mt-1.5">{failedIds[productId]}</p>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={onClose}
                className="btn-press px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || items.every((i) => !entries[i.Product?.product_id ?? i.product_id]?.rating)}
                className="btn-press px-5 py-2 rounded-xl bg-[#004953] text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting…" : "Submit Reviews"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RateOrderModal;
