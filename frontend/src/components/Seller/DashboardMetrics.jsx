import React from 'react';
import { DollarSign, ShoppingBag, Clock } from 'lucide-react';

const DashboardMetrics = ({ metrics }) => {
  const items = [
    {
      title: "Today's Gross Sales",
      value: `$${(metrics?.todayRevenue ?? 0).toFixed(2)}`,
      subtext: `${metrics?.todayOrdersCount ?? 0} orders today`,
      icon: DollarSign,
      bg: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Active Prep Queue",
      value: `${metrics?.activeQueue ?? 0} Orders`,
      subtext: `${metrics?.pendingCount ?? 0} pending manual acceptance`,
      icon: ShoppingBag,
      bg: "bg-amber-50 text-amber-700",
    },
    {
      title: "Orders Today",
      value: `${metrics?.todayOrdersCount ?? 0}`,
      subtext: "Across all statuses",
      icon: Clock,
      bg: "bg-teal-50 text-[#004D40]",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <div key={index} className="card-hover bg-white border border-gray-200/80 p-6 rounded-2xl shadow-sm flex items-center gap-4">
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

export default DashboardMetrics;
