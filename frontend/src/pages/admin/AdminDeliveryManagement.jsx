import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Bike,
  Truck,
  Clock3,
  Power,
  RefreshCw,
} from "lucide-react";

import AdminSidebar from "../../components/admin/AdminSidebar";
import Reveal from "../../components/common/Reveal";
import { PATH } from "../../path";

import {getDrivers,toggleDriverStatus,deleteDriver, updateDriver} from "../../api/adminApi";

export default function AdminDeliveryManagement() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  /* ================= FETCH ================= */
  const fetchDrivers = async () => {
    try {
      setLoading(true);

      const data = await getDrivers();

      if (data.success) {
        setDrivers(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  /* ================= TOGGLE STATUS ================= */
  const handleToggleDriver = async (id) => {
    try {
      setUpdating(id);

      const data = await toggleDriverStatus(id);

      if (data.success) {
        setDrivers((prev) =>
          prev.map((driver) =>
            driver.driver_id === id
              ? {
                  ...driver,
                  current_status: data.data.current_status,
                }
              : driver
          )
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  /* ================= STATS ================= */
  const availableDrivers = drivers.filter(
    (d) => d.current_status === "available"
  ).length;

  const busyDrivers = drivers.filter(
    (d) => d.current_status === "busy"
  ).length;

  const offlineDrivers = drivers.filter(
    (d) => d.current_status === "offline"
  ).length;

  /* ================= FILTER ================= */
  const filteredDrivers = useMemo(() => {
    return drivers
      .filter((driver) => {
        const keyword = search.toLowerCase();

        return (
          driver.User?.full_name?.toLowerCase().includes(keyword) ||
          driver.vehicle_type?.toLowerCase().includes(keyword)
        );
      })
      .filter((driver) => {
        if (filter === "available")
          return driver.current_status === "available";

        if (filter === "busy")
          return driver.current_status === "busy";

        if (filter === "offline")
          return driver.current_status === "offline";

        return true;
      });
  }, [drivers, search, filter]);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Delete this driver?");
    if (!confirm) return;

    try {
      const res = await deleteDriver(id);

      if (res.success !== false) {
        setDrivers((prev) =>
          prev.filter((d) => d.driver_id !== id)
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const [editDriver, setEditDriver] = useState(null);
  const [formData, setFormData] = useState({
    vehicle_type: "",
    license_number: "",
    current_status: "",
  });
  const handleEdit = async (driver) => {
    
    setEditDriver(driver);

    setFormData({
      vehicle_type: driver.vehicle_type || "",
      license_number: driver.license_number || "",
      current_status: driver.current_status || "",
    });
  
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      const res = await updateDriver(editDriver.driver_id, formData);

      if (res.success) {
        setDrivers((prev) =>
          prev.map((d) =>
            d.driver_id === editDriver.driver_id ? res.data : d
          )
        );

        setEditDriver(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500 animate-pulse">
          Loading drivers...
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar PATH={PATH} />
      {editDriver && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

          <div className="bg-white w-full max-w-[400px] rounded-2xl p-6 shadow-xl animate-fade-in-scale">

            <h2 className="text-xl font-bold mb-4">
              Edit Driver
            </h2>

            {/* Vehicle Type */}
            <label className="text-sm text-slate-600">
              Vehicle Type
            </label>
            <input
              name="vehicle_type"
              value={formData.vehicle_type}
              onChange={handleChange}
              className="w-full mt-1 mb-3 px-3 py-2 border rounded-lg"
            />

            {/* License */}
            <label className="text-sm text-slate-600">
              License Number
            </label>
            <input
              name="license_number"
              value={formData.license_number}
              onChange={handleChange}
              className="w-full mt-1 mb-3 px-3 py-2 border rounded-lg"
            />

            {/* Status */}
            <label className="text-sm text-slate-600">
              Status
            </label>
            <select
              name="current_status"
              value={formData.current_status}
              onChange={handleChange}
              className="w-full mt-1 mb-4 px-3 py-2 border rounded-lg"
            >
              <option value="available">Available</option>
              <option value="busy">Busy</option>
              <option value="offline">Offline</option>
            </select>

            {/* Buttons */}
            <div className="flex justify-end gap-2">

              <button
                onClick={() => setEditDriver(null)}
                className="px-4 py-2 rounded-lg bg-gray-200 btn-press"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="px-4 py-2 rounded-lg bg-teal-600 text-white btn-press"
              >
                Save
              </button>

            </div>

          </div>
        </div>
      )}

      <main className="flex-1">

        {/* HEADER */}
        <div className="sticky top-0 bg-white/70 backdrop-blur-xl z-20">
          <div className="py-4 sm:h-20 px-4 sm:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">

            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                Delivery Management
              </h1>
              <p className="text-slate-500">
                Monitor all delivery drivers
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">

              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-3 text-slate-400"
                />

                <input
                  placeholder="Search driver..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full sm:w-72 rounded-xl bg-white shadow-sm outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <button
                onClick={fetchDrivers}
                className="px-4 py-2 sm:py-0 rounded-xl bg-white shadow-sm hover:bg-slate-100 transition flex items-center justify-center gap-2 btn-press"
              >
                <RefreshCw size={16} />
                Refresh
              </button>

            </div>

          </div>
        </div>

        <div className="p-4 sm:p-8 space-y-8">

          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            <Reveal delay={0}>
              <StatCard
                title="Available"
                value={availableDrivers}
                icon={<Bike size={20} />}
                color="bg-green-500"
              />
            </Reveal>

            <Reveal delay={80}>
              <StatCard
                title="Busy"
                value={busyDrivers}
                icon={<Truck size={20} />}
                color="bg-yellow-500"
              />
            </Reveal>

            <Reveal delay={160}>
              <StatCard
                title="Offline"
                value={offlineDrivers}
                icon={<Clock3 size={20} />}
                color="bg-slate-500"
              />
            </Reveal>

          </div>

          {/* FILTER */}
          <div className="flex gap-3 flex-wrap">

            <FilterButton
              active={filter === "all"}
              onClick={() => setFilter("all")}
            >
              All ({drivers.length})
            </FilterButton>

            <FilterButton
              active={filter === "available"}
              onClick={() => setFilter("available")}
            >
              Available ({availableDrivers})
            </FilterButton>

            <FilterButton
              active={filter === "busy"}
              onClick={() => setFilter("busy")}
            >
              Busy ({busyDrivers})
            </FilterButton>

            <FilterButton
              active={filter === "offline"}
              onClick={() => setFilter("offline")}
            >
              Offline ({offlineDrivers})
            </FilterButton>

          </div>

          {/* DRIVER LIST */}
          <div className="grid gap-4">

            {filteredDrivers.length === 0 && (
              <div className="bg-white rounded-2xl p-10 text-center text-slate-500 shadow-sm">
                No drivers found.
              </div>
            )}

            {filteredDrivers.map((driver, i) => (
              <Reveal
                key={driver.driver_id}
                delay={Math.min(i, 8) * 60}
                className="bg-white rounded-2xl shadow-sm p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 hover:shadow-md transition card-hover"
              >

                <div className="flex items-center gap-4">

                  <div className="relative">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-600 to-teal-500 text-white flex items-center justify-center text-lg font-bold">
                      {driver.User?.full_name?.charAt(0)}
                    </div>

                    <span
                      className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${
                        driver.current_status === "available"
                          ? "bg-green-500"
                          : driver.current_status === "busy"
                          ? "bg-yellow-500"
                          : "bg-slate-400"
                      }`}
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg">
                      {driver.User?.full_name}
                    </h3>
                    <p className="text-sm text-slate-500">
                      Driver #{driver.driver_id}
                    </p>
                    <p className="text-sm text-slate-400">
                      {driver.vehicle_type}
                    </p>
                  </div>

                </div>

                <div className="flex flex-wrap items-center gap-3 sm:gap-4">

                  <span
                    className={`px-4 py-1 rounded-full text-sm font-medium ${
                      driver.current_status === "available"
                        ? "bg-green-100 text-green-700"
                        : driver.current_status === "busy"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {driver.current_status}
                  </span>

                  <button
                    disabled={updating === driver.driver_id}
                    onClick={() =>
                      handleToggleDriver(driver.driver_id)
                    }
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition disabled:opacity-50 btn-press"
                  >
                    <Power size={16} />
                    {updating === driver.driver_id
                      ? "Updating..."
                      : driver.current_status === "offline"
                      ? "Activate"
                      : "Set Offline"}
                  </button>


                  <button
                    onClick={() => handleDelete(driver.driver_id)}
                    className="px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 btn-press"
                  >
                    Delete
                  </button>

                  <button
                    onClick={() => handleEdit(driver)}
                    className="px-3 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600 btn-press"
                  >
                    Edit
                  </button>

                </div>

              </Reveal>
            ))}

          </div>

        </div>
      </main>
    </div>
  );
}

/* ================= UI COMPONENTS ================= */

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm card-hover">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-slate-500">{title}</p>
          <h2 className="text-3xl font-bold mt-1">{value}</h2>
        </div>

        <div className={`w-12 h-12 rounded-xl ${color} text-white flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function FilterButton({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 rounded-xl transition font-medium btn-press ${
        active
          ? "bg-slate-900 text-white"
          : "bg-white shadow-sm hover:bg-slate-100 text-slate-600"
      }`}
    >
      {children}
    </button>
  );
}