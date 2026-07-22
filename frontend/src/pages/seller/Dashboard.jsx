import { Bell, Search } from "lucide-react";
import { useEffect, useState } from "react";
import DashboardMetrics from '../../components/Seller/DashboardMetrics';
import RevenueChart from '../../components/Seller/RevenueChart';
import OrdersStream from '../../components/Seller/OrdersStream';
import { getDashboardMetrics, getRevenueChart, getOrdersStream } from '../../api/sellerApi';
import Reveal from '../../components/common/Reveal';

const Dashboard = () => {
  const [search, setSearch] = useState("");
  const [metrics, setMetrics] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [stream, setStream] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [metricsRes, revenueRes, streamRes] = await Promise.all([
          getDashboardMetrics(),
          getRevenueChart(),
          getOrdersStream(),
        ]);

        if (!metricsRes.success) {
          setError(metricsRes.message || "Failed to load dashboard data.");
          return;
        }

        setMetrics(metricsRes.data);
        setRevenue(revenueRes.data ?? []);
        setStream(streamRes.data ?? []);
      } catch {
        setError("Server unreachable. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
      <main className="flex-1">
        <header className="sticky top-0 z-20 backdrop-blur-xl bg-white/70 border-b border-white/40">
          <div className="min-h-20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-8 py-3 sm:py-0">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Command Center</h1>
              <p className="text-xs sm:text-sm text-slate-500">Glazed & Confused Donuts — Hub Live Terminal Monitor</p>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                <input
                  placeholder="Search orders..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full sm:w-72 pl-10 pr-4 py-2 rounded-2xl bg-white/80 border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <button className="btn-press w-10 h-10 shrink-0 rounded-2xl bg-white shadow-sm border flex items-center justify-center hover:scale-105 transition">
                <Bell size={18} />
              </button>
              <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-teal-600 to-teal-400 text-white flex items-center justify-center font-bold shadow">
                S
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
          {loading ? (
            <p className="text-center text-slate-400 py-12 text-sm">Loading dashboard...</p>
          ) : error ? (
            <p className="text-center text-red-500 py-12 text-sm">{error}</p>
          ) : (
            <>
              <Reveal>
                <DashboardMetrics metrics={metrics} />
              </Reveal>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <Reveal delay={80} className="lg:col-span-2 bg-white/70 backdrop-blur-xl rounded-3xl shadow-sm border border-white/40 p-4 sm:p-6">
                  <RevenueChart data={revenue} />
                </Reveal>
                <Reveal delay={160} className="lg:col-span-1 bg-white/70 backdrop-blur-xl rounded-3xl shadow-sm border border-white/40 p-4 sm:p-6">
                  <OrdersStream orders={stream} />
                </Reveal>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
