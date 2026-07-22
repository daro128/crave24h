// DeliveryDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, CheckCircle2, Clock, XCircle, TrendingUp } from "lucide-react";
import DeliveryNav from "../../components/delivery/DeliveryNav";
import DeliverySideNav from "../../components/delivery/DeliverySideNav";
import NewOrder from "../../components/delivery/NewOrder"
import Reveal from "../../components/common/Reveal";

const BASE = "http://localhost:5000/api";

export default function DeliveryDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const driverId = user?.Driver?.driver_id ?? user?.driver_id;

  const [orders, setOrders] = useState([]);
  const [stats,  setStats]  = useState(null);
  const [online, setOnline] = useState(true);

  useEffect(() => {
    if (!user) navigate("/auth/login");
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res  = await fetch(`${BASE}/driver/available`);
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : data.data ?? []);
      } catch (e) {
        console.error("fetchOrders error:", e);
      }
    };
    fetchOrders();
    const iv = setInterval(fetchOrders, 10000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (!driverId) return;
    const fetchStats = async () => {
      try {
        const res  = await fetch(`${BASE}/deliver/stats/${driverId}`);
        const data = await res.json();
        if (data.success) setStats(data.data);
      } catch (e) {
        console.error("fetchStats error:", e);
      }
    };
    fetchStats();
  }, [driverId]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
      <DeliveryNav online={online} onToggleOnline={() => setOnline((o) => !o)} />

      <div className="flex flex-1">
        <DeliverySideNav />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
              {greeting()}, {user?.full_name ?? "Driver"} 👋
            </h1>
            <p className="text-sm text-slate-500">Here's your overview for today.</p>
          </div>

          <Reveal className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
            <StatCard title="Total Deliveries" value={stats?.total     ?? "—"} icon={<Package      size={20} />} color="from-blue-500 to-blue-400"   />
            <StatCard title="Completed"         value={stats?.delivered ?? "—"} icon={<CheckCircle2 size={20} />} color="from-green-500 to-green-400"  />
            <StatCard title="In Progress"       value={stats?.pending   ?? "—"} icon={<Clock        size={20} />} color="from-orange-500 to-orange-400"/>
            <StatCard title="Cancelled"         value={stats?.cancelled ?? "—"} icon={<XCircle      size={20} />} color="from-red-500 to-red-400"      />
          </Reveal>

          {stats && (
            <Reveal delay={80} className="bg-gradient-to-r from-teal-600 to-cyan-500 rounded-3xl p-4 sm:p-6 text-white flex flex-wrap items-center justify-between gap-4 shadow-lg card-hover">
              <div>
                <p className="text-sm opacity-80">Total Earnings</p>
                <h2 className="text-3xl sm:text-4xl font-bold mt-1">
                  ${parseFloat(stats.totalEarnings ?? 0).toFixed(2)}
                </h2>
                <p className="text-sm opacity-70 mt-1">
                  From {stats.delivered} completed deliveries
                </p>
              </div>
              <TrendingUp size={48} className="opacity-30" />
            </Reveal>
          )}

          <Reveal delay={160} className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 p-4 sm:p-6 border-b border-white/30">
              <h2 className="font-semibold text-lg text-slate-800">Incoming Orders</h2>
              <span className="text-sm text-slate-500">{orders.length} available</span>
            </div>

            <div className="p-4 sm:p-6 grid md:grid-cols-2 gap-4">
              {orders.length > 0 ? (
                orders.map((order, index) => (
                  <Reveal key={order.delivery_id} delay={Math.min(index, 6) * 80}>
                    <NewOrder
                      order={order}
                      onAccepted={async () => {
                        const res  = await fetch(`${BASE}/driver/available`);
                        const data = await res.json();
                        setOrders(Array.isArray(data) ? data : data.data ?? []);
                      }}
                    />
                  </Reveal>
                ))
              ) : (
                <div className="col-span-2 text-center py-14 text-slate-400">
                  <Package size={40} className="mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No incoming orders</p>
                  <p className="text-xs mt-1">Auto-refreshing every 10 seconds</p>
                </div>
              )}
            </div>
          </Reveal>
        </main>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl p-4 sm:p-6 shadow-sm card-hover">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <h2 className="text-2xl sm:text-3xl font-bold mt-1 text-slate-800">{value}</h2>
        </div>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br ${color} shrink-0`}>
          {icon}
        </div>
      </div>
    </div>
  );
}