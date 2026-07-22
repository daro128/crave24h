import { Bell, Wifi, WifiOff } from "lucide-react";
import { PATH } from "../../path.js";
import Logo from "../common/Logo";

export default function DeliveryNav({ online = true, onToggleOnline }) {
  return (
    <div className="sticky top-0 z-20 backdrop-blur-xl bg-white/70 border-b border-white/40">
      <div className="h-20 flex justify-between items-center px-4 sm:px-8">
        {/* Logo */}
        <Logo to={PATH.DELIVERY.DASHBOARD} />

        {/* Right controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Online toggle */}
          <button
            onClick={onToggleOnline}
            className={`btn-press flex items-center gap-2 px-3 sm:px-4 py-2 rounded-2xl border text-sm font-medium transition ${
              online
                ? "bg-green-50 border-green-300 text-green-700 hover:bg-green-100"
                : "bg-slate-100 border-slate-300 text-slate-500 hover:bg-slate-200"
            }`}
          >
            {online ? <Wifi size={15} /> : <WifiOff size={15} />}
            <span className="hidden sm:inline">{online ? "Online" : "Offline"}</span>
          </button>

          <button className="btn-press w-10 h-10 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center hover:scale-105 transition">
            <Bell size={18} className="text-slate-600" />
          </button>
        </div>
      </div>
    </div>
  );
}