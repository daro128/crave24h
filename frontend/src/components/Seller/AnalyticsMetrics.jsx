import React from 'react';
import { TrendingUp, ShoppingBag, Coins, Users } from 'lucide-react';

const changeLabel = (pct) => `${pct >= 0 ? '▲' : '▼'} ${pct >= 0 ? '+' : ''}${pct}%`;
const changeColor = (pct) => (pct >= 0 ? 'text-emerald-600' : 'text-rose-600');

const AnalyticsMetrics = ({ summary }) => {
  const stats = [
    {
      title: "Monthly Gross Revenue",
      value: `$${(summary?.totalRevenue ?? 0).toFixed(2)}`,
      change: changeLabel(summary?.revenueChangePct ?? 0),
      color: changeColor(summary?.revenueChangePct ?? 0),
      suffix: "vs last month",
      icon: Coins,
      bg: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Volume Processed",
      value: `${summary?.totalOrders ?? 0} Orders`,
      change: changeLabel(summary?.ordersChangePct ?? 0),
      color: changeColor(summary?.ordersChangePct ?? 0),
      suffix: "vs last month",
      icon: ShoppingBag,
      bg: "bg-blue-50 text-blue-600",
    },
    {
      title: "Average Basket Value",
      value: `$${(summary?.avgBasket ?? 0).toFixed(2)}`,
      change: changeLabel(summary?.avgBasketChangePct ?? 0),
      color: changeColor(summary?.avgBasketChangePct ?? 0),
      suffix: "vs last month",
      icon: TrendingUp,
      bg: "bg-amber-50 text-amber-700",
    },
    {
      title: "Customer Retention",
      value: `${summary?.retentionRate ?? 0}%`,
      change: "of this month's customers are repeat buyers",
      color: "text-gray-400 font-normal",
      suffix: "",
      icon: Users,
      bg: "bg-teal-50 text-[#004D40]",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div key={idx} className="card-hover bg-white border border-gray-200/80 p-5 rounded-2xl shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.title}</span>
              <div className={`p-2 rounded-lg ${stat.bg}`}><Icon size={16} /></div>
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-800">{stat.value}</h3>
              <span className={`text-xs font-bold ${stat.color} block mt-0.5`}>{stat.change} <span className="text-gray-400 font-normal">{stat.suffix}</span></span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AnalyticsMetrics;
