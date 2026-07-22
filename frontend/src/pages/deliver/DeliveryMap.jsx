import { API_URL } from "../../config";
import { useEffect, useState } from "react";
import {
  Check, Utensils, Bike, CircleCheckBig,
  Phone, MessageSquare, MapPin, AlertCircle,
} from "lucide-react";

import DeliveryNav from "../../components/delivery/DeliveryNav";
import DeliverySideNav from "../../components/delivery/DeliverySideNav";
import Reveal from "../../components/common/Reveal";

const BASE    = API_URL;
const STEPS = [
  "accepted",
  "picked_up",
  "on_the_way",
  "delivered",
];
const LABELS = [
  "Accepted",
  "Picked Up",
  "On the Way",
  "Delivered",
];
const ICONS   = [Check, Utensils, Bike, CircleCheckBig];
const BUTTONS = [
  "Pick Up Order",
  "Start Delivery",
  "Mark as Delivered",
  null,
];
export default function DeliveryMap() {
  const user     = JSON.parse(localStorage.getItem("user"));
  console.log(user);
  const driverId = user?.driver_id;
  console.log(driverId);

  const [delivery, setDelivery] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [updating, setUpdating] = useState(false);
  const [toast,    setToast]    = useState(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchActive = async () => {
    if (!driverId) return;
    try {
      const res  = await fetch(`${BASE}/deliver/active/${driverId}`);
      const data = await res.json();
      setDelivery(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchActive(); }, []);

  const currentIndex = STEPS.indexOf(delivery?.delivery_status ?? "pending");

  const handleAdvance = async () => {
    if (!delivery || currentIndex >= STEPS.length - 1) return;
    const nextStatus = STEPS[currentIndex + 1];
    setUpdating(true);
    try {
      const res  = await fetch(`${BASE}/deliver/status/${delivery.delivery_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setDelivery((prev) => ({ ...prev, delivery_status: nextStatus }));
        showToast("success", `Status updated to "${nextStatus.replace("_", " ")}"`);
      }
    } catch (error) {
      showToast("error", "Failed to update status.",error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
      <DeliveryNav />

      <div className="flex flex-1">
        <DeliverySideNav />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 relative">
          {/* Toast */}
          {toast && (
            <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl shadow-lg text-white text-sm font-medium animate-fade-in-scale ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
              {toast.msg}
            </div>
          )}

          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Active Delivery</h1>
            <p className="text-sm text-slate-500">Track and manage your current order</p>
          </div>

          {loading ? (
            <p className="text-slate-400 text-sm animate-pulse">Loading...</p>
          ) : !delivery ? (
            <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl shadow-sm p-8 sm:p-12 text-center text-slate-400">
              <Bike size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">No active delivery right now.</p>
              <p className="text-xs mt-1">Accept an order from the Dashboard to get started.</p>
            </div>
          ) : (
            <div className="max-w-2xl space-y-6">
              {/* Tracking card */}
              <Reveal className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl shadow-sm p-5 sm:p-8 space-y-6 sm:space-y-8">
                {/* Header */}
                <div className="flex flex-wrap justify-between items-start gap-3">
                  <div>
                    <p className="text-sm text-slate-500">Active Delivery</p>
                    <h2 className="text-2xl font-bold text-slate-800">
                      Order #{delivery.order_id}
                    </h2>
                  </div>
                  <span className="bg-teal-50 border border-teal-200 text-teal-700 px-4 py-1.5 rounded-full text-sm font-medium capitalize">
                    {delivery.delivery_status?.replace("_", " ")}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="relative overflow-x-auto">
                  <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-200" />
                  <div
                    className="absolute top-5 left-0 h-0.5 bg-teal-600 transition-all duration-500"
                    style={{ width: `${(currentIndex / (STEPS.length - 1)) * 100}%` }}
                  />
                  <div className="relative flex justify-between min-w-[320px]">
                    {STEPS.map((_, i) => {
                      const Icon = ICONS[i];
                      const done   = i < currentIndex;
                      const active = i === currentIndex;
                      return (
                        <div key={i} className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            done   ? "bg-teal-600 text-white" :
                            active ? "bg-teal-600 text-white ring-4 ring-teal-100" :
                                     "bg-slate-200 text-slate-400"
                          }`}>
                            <Icon size={18} />
                          </div>
                          <span className={`mt-2 text-xs font-medium text-center w-20 ${done || active ? "text-teal-700" : "text-slate-400"}`}>
                            {LABELS[i]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Restaurant info */}
                {delivery.Order?.Restaurant && (
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-600 to-cyan-500 text-white flex items-center justify-center font-bold text-lg shrink-0">
                      {delivery.Order.Restaurant.restaurant_name?.[0] ?? "R"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-slate-500">Pickup from</p>
                      <p className="font-semibold text-slate-800 truncate">{delivery.Order.Restaurant.restaurant_name}</p>
                      {delivery.Order.Restaurant.address && (
                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                          <MapPin size={11} className="shrink-0" /> <span className="truncate">{delivery.Order.Restaurant.address}</span>
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Action button */}
                {BUTTONS[currentIndex] && (
                  <button
                    onClick={handleAdvance}
                    disabled={updating}
                    className="btn-press w-full bg-gradient-to-r from-teal-600 to-teal-500 text-white py-4 rounded-2xl font-semibold shadow hover:scale-[1.01] transition disabled:opacity-50"
                  >
                    {updating ? "Updating…" : BUTTONS[currentIndex]}
                  </button>
                )}

                {currentIndex === STEPS.length - 1 && (
                  <div className="text-center text-green-600 font-semibold py-2">
                    ✓ Delivery completed!
                  </div>
                )}
              </Reveal>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}