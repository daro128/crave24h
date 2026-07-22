import React, { useEffect, useState } from 'react';
import OrderFilters from '../../components/Seller/OrderFilters';
import OrderCard from '../../components/Seller/OrderCard';
import Reveal from '../../components/common/Reveal';
import { getOrders, acceptOrder, prepareOrder, sendOrderForDelivery, cancelOrder } from '../../api/sellerApi';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getOrders();
        if (!res.success) {
          setError(res.message || "Failed to load orders.");
          return;
        }
        setOrders(res.data);
      } catch {
        setError("Server unreachable. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const applyUpdatedOrder = (res) => {
    if (res.success) {
      setOrders((prev) => prev.map((o) => (o.order_id === res.data.order_id ? res.data : o)));
    } else {
      alert(res.message || "That action isn't available right now.");
    }
  };

  const handleAccept = async (id) => applyUpdatedOrder(await acceptOrder(id));
  const handlePrepare = async (id) => applyUpdatedOrder(await prepareOrder(id));
  const handleSendForDelivery = async (id) => applyUpdatedOrder(await sendOrderForDelivery(id));
  const handleCancel = async (id) => applyUpdatedOrder(await cancelOrder(id));

  const counts = {
    all: orders.filter((o) => !['delivered', 'cancelled'].includes(o.order_status)).length,
    pending: orders.filter((o) => o.order_status === 'pending').length,
    accepted: orders.filter((o) => o.order_status === 'accepted').length,
    preparing: orders.filter((o) => o.order_status === 'preparing').length,
    out_for_delivery: orders.filter((o) => o.order_status === 'out_for_delivery').length,
  };

  const filteredOrders = orders.filter((order) => {
    if (activeFilter === 'all') return !['delivered', 'cancelled'].includes(order.order_status);
    return order.order_status === activeFilter;
  });

  if (loading) return <p className="text-center text-gray-400 py-12 text-sm">Loading orders...</p>;
  if (error) return <p className="text-center text-red-500 py-12 text-sm">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-800 tracking-tight">Kitchen Orders</h2>
          <p className="text-sm text-gray-500 mt-0.5">Fulfill streaming guest orders, update execution tracks, and manage handovers.</p>
        </div>
      </div>

      <OrderFilters activeFilter={activeFilter} setActiveFilter={setActiveFilter} counts={counts} />

      {filteredOrders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order, index) => (
            <Reveal key={order.order_id} delay={Math.min(index, 6) * 80}>
              <OrderCard
                order={order}
                onAccept={handleAccept}
                onPrepare={handlePrepare}
                onSendForDelivery={handleSendForDelivery}
                onCancel={handleCancel}
              />
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center max-w-md mx-auto shadow-sm">
          <p className="text-sm font-bold text-gray-800">Clear Queue</p>
          <p className="text-xs text-gray-400 mt-1">There are no orders current flagged under this processing matrix.</p>
        </div>
      )}
    </div>
  );
};

export default Orders;
