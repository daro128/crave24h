import { Package } from "lucide-react";
import Reveal from "../common/Reveal";

const deliveries = [
  { id: "#ORD-28491", restaurant: "The Burger Joint",  date: "Oct 20, 2023 • 12:45 PM", amount: "$12.40" },
  { id: "#ORD-28477", restaurant: "Pasta Express",     date: "Oct 20, 2023 • 11:20 AM", amount: "$8.50"  },
  { id: "#ORD-28450", restaurant: "Pho 24h Central",   date: "Oct 19, 2023 • 08:15 PM", amount: "$15.20" },
];

export default function DeliveryHistory() {
  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl shadow-sm p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-semibold text-lg text-slate-800">Delivery History</h2>
        <Package size={18} className="text-slate-400" />
      </div>

      <div className="space-y-3">
        {deliveries.map((d, index) => (
          <Reveal key={d.id} delay={Math.min(index, 6) * 80}>
            <div
              className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 card-hover"
            >
              <div>
                <p className="text-xs text-slate-400">{d.id}</p>
                <h3 className="font-semibold text-slate-800">{d.restaurant}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{d.date}</p>
              </div>
              <div className="text-left sm:text-right">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                  Delivered
                </span>
                <p className="font-bold text-lg text-slate-800 mt-2">{d.amount}</p>
                <p className="text-xs text-slate-400">Earned</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}