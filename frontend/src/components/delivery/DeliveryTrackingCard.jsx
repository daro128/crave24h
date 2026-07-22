import {
  Check,
  Utensils,
  Bike,
  CircleCheckBig,
  Phone,
  MessageSquare,
  MapPin,
} from "lucide-react";
import Reveal from "../common/Reveal";

export default function DeliveryTrackingCard() {
  const currentStep = 1;

  const steps = [
    { icon: Check,          label: "Heading" },
    { icon: Utensils,       label: "Picking" },
    { icon: Bike,           label: "On the way" },
    { icon: CircleCheckBig, label: "Delivered" },
  ];

  return (
    <Reveal className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl shadow-sm p-5 sm:p-8 space-y-6 sm:space-y-8">

      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-3">
        <div>
          <p className="text-sm text-slate-500">Active Delivery</p>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Order #CR24-8821</h2>
        </div>
        <div className="bg-slate-100 px-4 py-2 rounded-full text-sm font-medium text-slate-700">
          2.4 km left
        </div>
      </div>

      {/* Progress */}
      <div className="relative overflow-x-auto">
        {/* Track background */}
        <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-200" />
        {/* Track fill */}
        <div
          className="absolute top-5 left-0 h-0.5 bg-teal-600 transition-all duration-500"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />

        <div className="relative flex justify-between min-w-[320px]">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const done = index < currentStep;
            const active = index === currentStep;

            return (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    done
                      ? "bg-teal-600 text-white"
                      : active
                      ? "bg-teal-600 text-white ring-4 ring-teal-100"
                      : "bg-slate-200 text-slate-400"
                  }`}
                >
                  <Icon size={18} />
                </div>
                <span
                  className={`mt-2 text-xs font-medium ${
                    done || active ? "text-teal-700" : "text-slate-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Customer Card */}
      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div className="flex gap-4 items-center">
            <img
              src="https://i.pravatar.cc/150?img=32"
              alt="customer"
              className="w-14 h-14 rounded-2xl object-cover"
            />
            <div>
              <h3 className="font-semibold text-slate-800">Sarah Johnson</h3>
              <p className="text-sm text-teal-600">Leave at door</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="btn-press w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700 transition">
              <Phone size={17} />
            </button>
            <button className="btn-press w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700 transition">
              <MessageSquare size={17} />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl px-4 py-3 flex items-center gap-3 border border-slate-100">
          <MapPin size={16} className="text-slate-400 shrink-0" />
          <span className="text-sm text-slate-600">
            221B Baker Street, North Wing Entrance, buzzer 042
          </span>
        </div>
      </div>

      {/* Action Button */}
      <button className="btn-press w-full bg-gradient-to-r from-teal-600 to-teal-500 text-white py-4 rounded-2xl font-semibold shadow hover:scale-[1.01] transition">
        I've arrived at restaurant
      </button>
    </Reveal>
  );
}