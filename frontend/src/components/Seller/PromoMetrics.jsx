import React from 'react';
import { Megaphone, Percent, Ticket } from 'lucide-react';

const PromoMetrics = ({ summary }) => {
  const metrics = [
    { title: "Active Campaigns", value: `${summary?.activeCampaigns ?? 0} Live Offers`, subtext: "Currently running", icon: Megaphone, bg: "bg-teal-50 text-[#004D40]" },
    { title: "Total Redemptions", value: `${summary?.totalRedemptions ?? 0} Claims`, subtext: "Across all campaigns", icon: Ticket, bg: "bg-emerald-50 text-emerald-700" },
    { title: "Avg. Discount Applied", value: `${summary?.avgDiscount ?? 0}% Off`, subtext: "Across all campaigns", icon: Percent, bg: "bg-amber-50 text-amber-700" }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div key={idx} className="card-hover bg-white border border-gray-200/80 p-6 rounded-2xl shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-xl ${item.bg}`}>
              <Icon size={22} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{item.title}</p>
              <h3 className="text-2xl font-black text-gray-800 mt-0.5">{item.value}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{item.subtext}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PromoMetrics;