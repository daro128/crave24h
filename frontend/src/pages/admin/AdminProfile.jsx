// AdminProfile.jsx
import { useEffect, useState } from "react";
import {
  Mail, Phone, ShieldCheck, Circle,
  Edit, X, CheckCircle, AlertCircle,
  Store, Bike, Users,
} from "lucide-react";

import AdminSidebar from "../../components/admin/AdminSidebar";
import PageLoader from "../../components/admin/PageLoader";
import Reveal from "../../components/common/Reveal";
import { PATH } from "../../path";
import { updateProfile } from "../../api/adminApi";
import { formatRole } from "../../utils/format";

export default function AdminProfile() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [stats,       setStats]       = useState(null);
  const [statsLoading,setStatsLoading]= useState(true);
  const [editModal,   setEditModal]   = useState(false);
  const [toast,       setToast]       = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/dashboard", {
      headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
    })
      .then((r) => r.json())
      .then((d) => { if (d.success) setStats(d.data); })
      .catch(() => {})
      .finally(() => setStatsLoading(false));
  }, []);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async (formData) => {
    const res = await updateProfile(formData);

    if (!res.success) {
      showToast("error", res.message || "Failed to update profile.");
      return;
    }

    const updated = { ...user, ...res.data };
    localStorage.setItem("user", JSON.stringify(updated));

    setEditModal(false);
    showToast("success", "Profile updated successfully.");
  };

  const initials =
    user?.full_name
      ?.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase() || "A";

  const isActive = user?.status === "active";

  if (!user) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-200">
        <AdminSidebar PATH={PATH} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <AlertCircle size={40} className="text-red-400 mx-auto" />
            <p className="text-slate-600 font-medium">Could not load your profile.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
      <AdminSidebar PATH={PATH} />

      <main className="flex-1 relative">
        {toast && (
          <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl shadow-lg text-white text-sm font-medium ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}>
            {toast.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            {toast.message}
          </div>
        )}

        <div className="sticky top-0 z-20 backdrop-blur-xl bg-white/70 border-b border-white/40">
          <div className="py-4 sm:h-20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 px-4 sm:px-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Admin Profile</h1>
              <p className="text-sm text-slate-500">Your account identity and system access</p>
            </div>
            <button
              onClick={() => setEditModal(true)}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white px-5 py-2.5 rounded-2xl shadow hover:scale-[1.02] transition btn-press"
            >
              <Edit size={18} /> Edit Profile
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-8 space-y-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* LEFT */}
            <Reveal className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-sm text-center">
              <div className="relative inline-block">
                <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-teal-600 to-cyan-500 text-white flex items-center justify-center text-4xl font-bold shadow-lg">
                  {initials}
                </div>
                <span className={`absolute -bottom-2 -right-2 w-4 h-4 rounded-full border-2 border-white ${isActive ? "bg-green-500" : "bg-red-400"}`} />
              </div>

              <h2 className="mt-6 text-xl font-bold text-slate-800">{user.full_name}</h2>
              <p className="text-slate-500 text-sm">{formatRole(user.role)}</p>

              <div className={`mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
              }`}>
                {isActive ? "Active Account" : "Inactive Account"}
              </div>

              <div className="mt-8 space-y-4 text-left">
                <Info icon={<Mail size={16}/>}        label="Email"  value={user.email} />
                <Info icon={<Phone size={16}/>}       label="Phone"  value={user.phone || "Not set"} />
                <Info icon={<ShieldCheck size={16}/>} label="Role"   value={user.role} />
                <Info icon={<Circle size={16}/>}      label="Status" value={user.status} />
              </div>
            </Reveal>

            {/* RIGHT */}
            <div className="lg:col-span-2 space-y-6">
              <Reveal delay={80} className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl p-8">
                <h2 className="text-lg font-semibold mb-6">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field label="Full Name" value={user.full_name} />
                  <Field label="Email"     value={user.email} />
                  <Field label="Phone"     value={user.phone} />
                  <Field label="Role"      value={user.role} />
                  <Field label="Status"    value={user.status} />
                  <Field label="User ID"   value={`#${user.id ?? user.user_id}`} />
                </div>
              </Reveal>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <Reveal delay={120}><MiniCard title="Restaurants" value={statsLoading ? "…" : (stats?.totalRestaurants ?? "—")} icon={<Store size={18}/>} color="from-green-500 to-green-400"  /></Reveal>
                <Reveal delay={180}><MiniCard title="Drivers"     value={statsLoading ? "…" : (stats?.totalDrivers     ?? "—")} icon={<Bike  size={18}/>} color="from-purple-500 to-purple-400"/></Reveal>
                <Reveal delay={240}><MiniCard title="Users"       value={statsLoading ? "…" : (stats?.totalUsers       ?? "—")} icon={<Users size={18}/>} color="from-blue-500 to-blue-400"   /></Reveal>
              </div>

              <Reveal delay={280} className="rounded-3xl p-8 text-white bg-gradient-to-br from-teal-600 to-cyan-500 shadow-lg card-hover">
                <h2 className="text-xl font-bold">Administrator Access</h2>
                <p className="text-sm opacity-90 mt-2">
                  Full system control: users, restaurants, deliveries, menus, and settings.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </main>

      {editModal && (
        <EditProfileModal
          user={user}
          onClose={() => setEditModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function EditProfileModal({ user, onClose, onSave }) {
  const [form, setForm]     = useState({ full_name: user.full_name || "", phone: user.phone || "" });
  const [saving, setSaving] = useState(false);
  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-7 relative animate-fade-in-scale">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-800">Edit Profile</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition btn-press"><X size={20}/></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none"
              value={form.full_name}
              onChange={set("full_name")}
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
            <input
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none"
              value={form.phone}
              onChange={set("phone")}
              placeholder="+855 xx xxx xxx"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <div className="px-4 py-2 rounded-xl bg-slate-100 text-slate-500 text-sm">{user.email}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
            <div className="px-4 py-2 rounded-xl bg-slate-100 text-slate-500 text-sm">{user.role}</div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm btn-press">
            Cancel
          </button>
          <button
            onClick={async () => { setSaving(true); await onSave(form); setSaving(false); }}
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-teal-600 text-white text-sm hover:bg-teal-700 disabled:opacity-50 btn-press"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Info({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">{icon}</div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm font-semibold text-slate-800">{value || "—"}</p>
      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <label className="text-xs text-slate-500">{label}</label>
      <div className="mt-1 px-4 py-3 rounded-2xl bg-slate-100 text-slate-700 text-sm">{value || "—"}</div>
    </div>
  );
}

function MiniCard({ title, value, icon, color }) {
  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-sm hover:scale-[1.02] transition card-hover">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <h3 className="text-2xl font-bold mt-1 text-slate-800">{value}</h3>
        </div>
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br ${color}`}>{icon}</div>
      </div>
    </div>
  );
}