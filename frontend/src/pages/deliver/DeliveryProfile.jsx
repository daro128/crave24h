// DeliveryProfile.jsx
import { useEffect, useState } from "react";
import {
  Mail, Phone, ShieldCheck, Circle,
  Edit, X, CheckCircle, AlertCircle,
  Package, Star, TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DeliveryNav from "../../components/delivery/DeliveryNav";
import DeliverySideNav from "../../components/delivery/DeliverySideNav";
import Reveal from "../../components/common/Reveal";

const BASE = "http://localhost:5000/api";

export default function DeliveryProfile() {
  const navigate  = useNavigate();
  const user      = JSON.parse(localStorage.getItem("user"));

  const [profile,  setProfile]  = useState(null);
  const [stats,    setStats]    = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [modal,    setModal]    = useState(false);
  const [toast,    setToast]    = useState(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (!user) { navigate("/auth/login"); return; }

    const fetchAll = async () => {
      try {
        const res  = await fetch(`${BASE}/deliver/profile`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: user.id ?? user.user_id }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message);

        setProfile(data.data);

        const driverId = data.data?.Driver?.driver_id;
        if (driverId) {
          const sr = await fetch(`${BASE}/deliver/stats/${driverId}`);
          const sd = await sr.json();
          if (sd.success) setStats(sd.data);
        }
      } catch (e) {
        setError(e.message ?? "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const handleSave = async ({ full_name, phone }) => {
    const res  = await fetch(`${BASE}/deliver/profile/${profile.user_id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ full_name, phone }),
    });
    const data = await res.json();
    if (!data.success) { showToast("error", data.message ?? "Update failed."); return; }

    // update localStorage so the name reflects immediately
    const updated = { ...user, full_name: data.data.full_name, phone: data.data.phone };
    localStorage.setItem("user", JSON.stringify(updated));

    setProfile((prev) => ({ ...prev, full_name: data.data.full_name, phone: data.data.phone }));
    setModal(false);
    showToast("success", "Profile updated.");
  };

  const initials =
    profile?.full_name?.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase() ?? "D";

  const isActive = profile?.status === "Active";

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
      <DeliveryNav />

      <div className="flex flex-1">
        <DeliverySideNav />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 relative">
          {toast && (
            <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl shadow-lg text-white text-sm font-medium animate-fade-in-scale ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
              {toast.type === "success" ? <CheckCircle size={16}/> : <AlertCircle size={16}/>}
              {toast.msg}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800">My Profile</h1>
              <p className="text-sm text-slate-500">Your account details and preferences</p>
            </div>
            {profile && (
              <button
                onClick={() => setModal(true)}
                className="btn-press flex items-center gap-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white px-5 py-2.5 rounded-2xl shadow hover:scale-[1.02] transition"
              >
                <Edit size={18} /> Edit Profile
              </button>
            )}
          </div>

          {loading ? (
            <p className="text-slate-400 text-sm animate-pulse">Loading profile...</p>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl px-6 py-4 text-sm flex items-center gap-2">
              <AlertCircle size={16} /> {error}
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
              <Reveal className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl p-6 sm:p-8 shadow-sm text-center card-hover">
                <div className="relative inline-block">
                  <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-teal-600 to-cyan-500 text-white flex items-center justify-center text-4xl font-bold shadow-lg">
                    {initials}
                  </div>
                  <span className={`absolute -bottom-2 -right-2 w-4 h-4 rounded-full border-2 border-white ${isActive ? "bg-green-500" : "bg-red-400"}`} />
                </div>
                <h2 className="mt-6 text-xl font-bold text-slate-800">{profile.full_name}</h2>
                <p className="text-slate-500 text-sm">{profile.role}</p>
                <div className={`mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                  {isActive ? "Active" : "Inactive"}
                </div>
                <div className="mt-8 space-y-4 text-left">
                  <InfoRow icon={<Mail size={16}/>}        label="Email"  value={profile.email} />
                  <InfoRow icon={<Phone size={16}/>}       label="Phone"  value={profile.phone || "Not set"} />
                  <InfoRow icon={<ShieldCheck size={16}/>} label="Role"   value={profile.role} />
                  <InfoRow icon={<Circle size={16}/>}      label="Status" value={profile.status} />
                </div>
              </Reveal>

              <div className="lg:col-span-2 space-y-6">
                <Reveal delay={80} className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl p-6 sm:p-8 shadow-sm">
                  <h2 className="text-lg font-semibold mb-6 text-slate-800">Personal Information</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <Field label="Full Name" value={profile.full_name} />
                    <Field label="Email"     value={profile.email} />
                    <Field label="Phone"     value={profile.phone} />
                    <Field label="Role"      value={profile.role} />
                    <Field label="Status"    value={profile.status} />
                    <Field label="User ID"   value={`#${profile.user_id}`} />
                  </div>
                </Reveal>

                <Reveal delay={160} className="grid sm:grid-cols-3 gap-4 sm:gap-6">
                  <MiniCard title="Total Deliveries" value={stats?.total     ?? "—"} icon={<Package    size={18}/>} color="from-blue-500 to-blue-400"  />
                  <MiniCard title="Completed"         value={stats?.delivered ?? "—"} icon={<Star       size={18}/>} color="from-green-500 to-green-400" />
                  <MiniCard title="Total Earned"      value={stats ? `$${parseFloat(stats.totalEarnings).toFixed(2)}` : "—"} icon={<TrendingUp size={18}/>} color="from-teal-600 to-teal-400" />
                </Reveal>

                <Reveal delay={240} className="rounded-3xl p-6 sm:p-8 text-white bg-gradient-to-br from-teal-600 to-cyan-500 shadow-lg">
                  <h2 className="text-xl font-bold">Driver Access</h2>
                  <p className="text-sm opacity-90 mt-2">
                    View your deliveries, earnings, and live order tracking all in one place.
                  </p>
                </Reveal>
              </div>
            </div>
          )}
        </main>
      </div>

      {modal && profile && (
        <EditModal user={profile} onClose={() => setModal(false)} onSave={handleSave} />
      )}
    </div>
  );
}

function EditModal({ user, onClose, onSave }) {
  const [form, setForm]   = useState({ full_name: user.full_name ?? "", phone: user.phone ?? "" });
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-7">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-800">Edit Profile</h2>
          <button onClick={onClose} className="btn-press text-slate-400 hover:text-slate-600"><X size={20}/></button>
        </div>
        <div className="space-y-4">
          {[["Full Name","full_name","text"],["Phone","phone","tel"]].map(([label,key,type]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
              <input type={type} value={form[key]} onChange={set(key)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none" />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <div className="px-4 py-2 rounded-xl bg-slate-100 text-slate-500 text-sm">{user.email}</div>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="btn-press px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm">Cancel</button>
          <button
            onClick={async () => { setSaving(true); await onSave(form); setSaving(false); }}
            disabled={saving}
            className="btn-press px-5 py-2 rounded-xl bg-teal-600 text-white text-sm hover:bg-teal-700 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">{icon}</div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm font-semibold text-slate-800">{value ?? "—"}</p>
      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <label className="text-xs text-slate-500">{label}</label>
      <div className="mt-1 px-4 py-3 rounded-2xl bg-slate-100 text-slate-700 text-sm">{value ?? "—"}</div>
    </div>
  );
}

function MiniCard({ title, value, icon, color }) {
  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl p-4 sm:p-6 shadow-sm card-hover">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <h3 className="text-xl sm:text-2xl font-bold mt-1 text-slate-800">{value}</h3>
        </div>
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br ${color} shrink-0`}>{icon}</div>
      </div>
    </div>
  );
}