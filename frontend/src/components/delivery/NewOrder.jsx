// NewOrder.jsx
import { MapPin, Clock, DollarSign, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";

const BASE = "http://localhost:5000/api";

export default function NewOrder({ order, onAccepted }) {
  const [loading, setLoading] = useState(false);
  const [declining, setDeclining] = useState(false);
  const [declined, setDeclined] = useState(false);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const handleAccept = async () => {
    console.log(user);
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${BASE}/driver/accept/${order.delivery_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to accept order");
        return;
      }
      onAccepted?.();
    } catch (e) {
      console.error("accept error:", e);
      setError("Network error — please try again");
    } finally {
      setLoading(false);
    }
  };

 
  const handleDecline = async () => {
    setDeclining(true);
    setError("");
    try {
      const res = await fetch(`${BASE}/driver/decline/${order.delivery_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.user_id }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to decline order");
        return;
      }
      setDeclined(true);
      onAccepted?.();
    } catch (e) {
      console.error("decline error:", e);
      setError("Network error — please try again");
    } finally {
      setDeclining(false);
    }
  };

  if (declined) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 card-hover space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-slate-400">
            Order #{order.order_id ?? order.delivery_id}
          </p>
          <h3 className="font-semibold text-slate-800 mt-0.5">
            {order.Order?.Restaurant?.restaurant_name ??
              order.restaurant_name ??
              "Restaurant"}
          </h3>
        </div>
        <span className="bg-orange-100 text-orange-700 text-xs font-medium px-3 py-1 rounded-full">
          New
        </span>
      </div>

      {/* Details */}
      <div className="space-y-2 text-sm text-slate-600">
        {order.Order?.Restaurant?.address && (
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-slate-400 shrink-0" />
            <span className="truncate">{order.Order.Restaurant.address}</span>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1">
            <DollarSign size={14} className="text-slate-400" />
            ${parseFloat(order.payout ?? order.delivery_fee ?? 0).toFixed(2)} fee
          </span>
          <span className="flex items-center gap-1">
            <Clock size={14} className="text-slate-400" />
            {order.pickup_time_estimate ?? order.estimated_time ?? "~20 min"}
          </span>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={handleDecline}
          disabled={declining || loading}
          className="btn-press flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-red-50 hover:border-red-200 hover:text-red-500 text-sm font-medium disabled:opacity-50 transition"
        >
          <XCircle size={16} /> {declining ? "Declining…" : "Decline"}
        </button>
        <button
          onClick={handleAccept}
          disabled={loading || declining}
          className="btn-press flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 text-white text-sm font-medium shadow hover:scale-[1.02] disabled:opacity-50 transition"
        >
          <CheckCircle size={16} />
          {loading ? "Accepting…" : "Accept"}
        </button>
      </div>
    </div>
  );
}