import { API_URL } from "../../config";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  ShoppingBag,
  Store,
  Users,
  Bike,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

import AdminSidebar from "../../components/admin/AdminSidebar";
import PageLoader from "../../components/admin/PageLoader";
import Reveal from "../../components/common/Reveal";
import { PATH } from "../../path";

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch(`${API_URL}/admin/dashboard`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
        const data = await res.json();

        if (!data.success) {
          setError("Failed to load dashboard data.");
          return;
        }

        setDashboard(data.data);
      } catch (err) {
        setError("Server unreachable. Please try again. : ",err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  /* ── derived ── */
  const filteredOrders = dashboard?.orders?.filter((order) => {
    const q = search.toLowerCase();
    return (
      String(order.order_id).includes(q) ||
      order.Restaurant?.restaurant_name?.toLowerCase().includes(q) ||
      order.Customer?.full_name?.toLowerCase().includes(q) ||
      order.order_status?.toLowerCase().includes(q)
    );
  });

  /* ── status counts from orders ── */
  const pendingCount = dashboard?.orders?.filter(
    (o) => o.order_status === "pending"
  ).length ?? 0;
  const deliveredCount = dashboard?.orders?.filter(
    (o) => o.order_status === "delivered"
  ).length ?? 0;
  const cancelledCount = dashboard?.orders?.filter(
    (o) => o.order_status === "cancelled"
  ).length ?? 0;

  if (loading) return <PageLoader text="Loading Dashboard..." />;

  if (error) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
        <AdminSidebar PATH={PATH} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <AlertCircle size={40} className="text-red-400 mx-auto" />
            <p className="text-slate-600 font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2 bg-teal-600 text-white rounded-2xl text-sm hover:bg-teal-700 transition btn-press"
            >
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
      <AdminSidebar PATH={PATH} />

      <main className="flex-1">
        {/* HEADER */}
        <header className="sticky top-0 z-20 backdrop-blur-xl bg-white/70 border-b border-white/40">
          <div className="py-4 sm:h-20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 px-4 sm:px-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
              <p className="text-sm text-slate-500">
                Welcome back, Administrator 👋
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative flex-1 sm:flex-initial">
                <Search
                  className="absolute left-3 top-2.5 text-slate-400"
                  size={18}
                />
                <input
                  placeholder="Search orders..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full sm:w-72 pl-10 pr-4 py-2 rounded-2xl bg-white/80 border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <button className="w-10 h-10 shrink-0 rounded-2xl bg-white shadow-sm border flex items-center justify-center hover:scale-105 transition btn-press">
                <Bell size={18} />
              </button>

              <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-teal-600 to-teal-400 text-white flex items-center justify-center font-bold shadow">
                A
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-8 space-y-8">
          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <Reveal delay={0}>
              <StatCard
                title="Total Orders"
                value={dashboard.totalOrders}
                icon={<ShoppingBag size={20} />}
                color="from-orange-500 to-orange-400"
              />
            </Reveal>
            <Reveal delay={80}>
              <StatCard
                title="Total Users"
                value={dashboard.totalUsers}
                icon={<Users size={20} />}
                color="from-blue-500 to-blue-400"
              />
            </Reveal>
            <Reveal delay={160}>
              <StatCard
                title="Restaurants"
                value={dashboard.totalRestaurants}
                icon={<Store size={20} />}
                color="from-green-500 to-green-400"
              />
            </Reveal>
            <Reveal delay={240}>
              <StatCard
                title="Drivers"
                value={dashboard.totalDrivers}
                icon={<Bike size={20} />}
                color="from-purple-500 to-purple-400"
              />
            </Reveal>
          </div>

          {/* MAIN GRID */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* ORDERS TABLE */}
            <Reveal className="lg:col-span-2 bg-white/70 backdrop-blur-xl rounded-3xl shadow-sm border border-white/40 overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-white/30">
                <h2 className="font-semibold text-lg">Recent Orders</h2>
                <button
                  onClick={() => navigate(PATH.adminOrders ?? "/admin/orders")}
                  className="text-teal-600 text-sm font-medium hover:underline btn-press"
                >
                  View all
                </button>
              </div>

              <div className="overflow-x-auto">
                {filteredOrders?.length === 0 ? (
                  <p className="text-center text-slate-400 py-12 text-sm">
                    No orders match your search.
                  </p>
                ) : (
                  <table className="w-full text-sm">
                    <thead className="text-slate-500 bg-slate-50/50">
                      <tr>
                        <th className="p-4 text-left">Order</th>
                        <th className="text-left">Customer</th>
                        <th className="text-left">Restaurant</th>
                        <th className="text-left">Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredOrders?.map((order) => (
                        <tr
                          key={order.order_id}
                          className="border-t hover:bg-slate-50/60 transition"
                        >
                          <td className="p-4 font-medium">
                            #{order.order_id}
                          </td>
                          <td>
                            {order.Customer?.full_name ?? "—"}
                          </td>
                          <td>
                            {order.Restaurant?.restaurant_name ?? "—"}
                          </td>
                          <td>
                            <StatusBadge status={order.order_status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </Reveal>

            {/* RIGHT PANEL */}
            <div className="space-y-6">
              {/* ORDER BREAKDOWN */}
              <Reveal delay={80} className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/40 shadow-sm">
                <h3 className="font-semibold mb-5">Order Breakdown</h3>

                <div className="space-y-4">
                  <Activity
                    title="Pending"
                    value={pendingCount}
                    dot="bg-yellow-400"
                  />
                  <Activity
                    title="Delivered"
                    value={deliveredCount}
                    dot="bg-green-500"
                  />
                  <Activity
                    title="Cancelled"
                    value={cancelledCount}
                    dot="bg-red-400"
                  />
                  <div className="border-t pt-4">
                    <Activity
                      title="Total"
                      value={dashboard.totalOrders}
                      dot="bg-slate-400"
                      bold
                    />
                  </div>
                </div>
              </Reveal>

              {/* SYSTEM OVERVIEW BANNER */}
              <Reveal delay={160} className="rounded-3xl p-6 text-white bg-gradient-to-br from-teal-600 to-cyan-500 shadow-lg card-hover">
                <TrendingUp className="mb-3" />
                <h2 className="text-xl font-bold">System Overview</h2>
                <p className="text-sm opacity-90 mt-2">
                  Track orders, users, restaurants, and deliveries in real time.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ════════════════════════════════════════
   COMPONENTS
════════════════════════════════════════ */

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-sm rounded-3xl p-6 hover:scale-[1.02] transition card-hover">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-slate-500 text-sm">{title}</p>
          <h2 className="text-3xl font-bold mt-1 text-slate-800">{value}</h2>
        </div>
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br ${color}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function Activity({ title, value, dot, bold }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${dot}`} />
        <span className="text-slate-500 text-sm">{title}</span>
      </div>
      <span
        className={`text-slate-800 text-sm ${bold ? "font-bold" : "font-semibold"}`}
      >
        {value}
      </span>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    delivered: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    cancelled: "bg-red-100 text-red-700",
    preparing: "bg-blue-100 text-blue-700",
    "on the way": "bg-purple-100 text-purple-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
        styles[status?.toLowerCase()] ?? "bg-slate-100 text-slate-600"
      }`}
    >
      {status ?? "Unknown"}
    </span>
  );
}