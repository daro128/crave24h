import React from 'react';
import { Clock, User, ArrowRight, X } from 'lucide-react';
import { timeAgo } from '../../utils/format';

const STATUS_CONFIG = {
  pending: { badge: 'bg-amber-100 text-amber-800 border-amber-200', label: 'Pending' },
  accepted: { badge: 'bg-indigo-100 text-indigo-800 border-indigo-200', label: 'Accepted' },
  preparing: { badge: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Preparing' },
  out_for_delivery: { badge: 'bg-purple-100 text-purple-800 border-purple-200', label: 'Out for Delivery' },
  delivered: { badge: 'bg-emerald-100 text-emerald-800 border-emerald-200', label: 'Delivered' },
  cancelled: { badge: 'bg-rose-100 text-rose-800 border-rose-200', label: 'Cancelled' },
};

const PRIMARY_ACTIONS = {
  pending: { text: 'Accept Order', handler: 'onAccept', btnClass: 'bg-amber-600 hover:bg-amber-700' },
  accepted: { text: 'Start Preparing', handler: 'onPrepare', btnClass: 'bg-indigo-600 hover:bg-indigo-700' },
  preparing: { text: 'Send for Delivery', handler: 'onSendForDelivery', btnClass: 'bg-blue-600 hover:bg-blue-700' },
};

const OrderCard = ({ order, onAccept, onPrepare, onSendForDelivery, onCancel }) => {
  const status = STATUS_CONFIG[order.order_status] ?? { badge: 'bg-gray-100 text-gray-600', label: order.order_status };
  const primaryAction = PRIMARY_ACTIONS[order.order_status];
  const canCancel = ['pending', 'accepted', 'preparing'].includes(order.order_status);

  const actionHandlers = { onAccept, onPrepare, onSendForDelivery };
  const handlePrimary = () => actionHandlers[primaryAction.handler](order.order_id);

  return (
    <div className="card-hover bg-white border border-gray-200/90 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between hover:border-gray-300 transition-all">
      <div className="p-5 space-y-4">

        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-mono font-black text-base text-gray-800">#{order.order_id}</h4>
            <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
              <Clock size={12} /> {timeAgo(order.order_date)}
            </div>
          </div>
          <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold border uppercase tracking-wider ${status.badge}`}>
            {status.label}
          </span>
        </div>

        <div className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-xl flex items-center gap-2 font-medium">
          <User size={14} className="text-gray-400" />
          <span>{order.Customer?.full_name ?? 'Customer'} • <span className="text-gray-400">{order.delivery_address}</span></span>
        </div>

        <div className="space-y-1.5 pt-1">
          {order.OrderItems?.map((item) => (
            <div key={item.order_item_id} className="flex justify-between text-sm">
              <span className="text-gray-600 font-medium"><span className="font-bold text-[#004D40]">{item.quantity}x</span> {item.Product?.product_name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50/50 px-5 py-3.5 border-t border-gray-100 flex items-center justify-between gap-4 mt-auto">
        <div>
          <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider">Total Value</span>
          <span className="text-base font-black text-gray-800">${Number(order.total_amount).toFixed(2)}</span>
        </div>

        <div className="flex items-center gap-2">
          {canCancel && (
            <button
              onClick={() => onCancel(order.order_id)}
              className="btn-press text-gray-400 hover:text-rose-600 p-2 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              title="Cancel order"
            >
              <X size={16} />
            </button>
          )}

          {primaryAction && (
            <button
              onClick={handlePrimary}
              className={`btn-press text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer ${primaryAction.btnClass}`}
            >
              {primaryAction.text}
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
