import React from 'react';
import { Clock } from 'lucide-react';
import { timeAgo } from '../../utils/format';

const STATUS_LABELS = {
  pending: { label: 'Pending', badge: 'bg-amber-100 text-amber-800' },
  accepted: { label: 'Accepted', badge: 'bg-indigo-100 text-indigo-800' },
  preparing: { label: 'In Kitchen', badge: 'bg-blue-100 text-blue-800' },
  out_for_delivery: { label: 'Out for Delivery', badge: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'Delivered', badge: 'bg-teal-100 text-teal-800' },
  cancelled: { label: 'Cancelled', badge: 'bg-rose-100 text-rose-800' },
};

const OrdersStream = ({ orders = [] }) => {
  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-sm font-bold text-gray-800">Live Kitchen Tracker</h4>
          <p className="text-xs text-gray-400 mt-0.5">Most recent incoming orders.</p>
        </div>
        <span className="text-xs font-bold text-[#004D40] bg-teal-50 px-2.5 py-1 rounded-lg flex items-center gap-1.5 animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-[#004D40]"></span> Live
        </span>
      </div>

      {orders.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-6">No orders yet.</p>
      ) : (
        <div className="divide-y divide-gray-100">
          {orders.map((order) => {
            const status = STATUS_LABELS[order.status] ?? { label: order.status, badge: 'bg-gray-100 text-gray-600' };
            return (
              <div key={order.id} className="py-3.5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 first:pt-0 last:pb-0">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-gray-800">#{order.id}</span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${status.badge}`}>{status.label}</span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium">{order.items}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-gray-800 block">${order.total.toFixed(2)}</span>
                  <span className="text-[10px] text-gray-400 font-medium inline-flex items-center gap-0.5"><Clock size={10}/> {timeAgo(order.order_date)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrdersStream;
