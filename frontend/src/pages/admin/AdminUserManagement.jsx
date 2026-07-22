import { useEffect, useState } from "react";
import {
  Search,
  Users,
  UserCheck,
  UserX,
  Pencil,
  Trash2,
  Ban,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import AdminSidebar from "../../components/admin/AdminSidebar";
import Reveal from "../../components/common/Reveal";
import { PATH } from "../../path";

import {
  getUsers,
  deleteUser,
  toggleUserStatus,
  updateUser,
  createUser,
} from "../../api/adminApi";

export default function AdminUserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal state
  const [editModal, setEditModal] = useState({ open: false, user: null });
  const [addModal, setAddModal] = useState(false);

  // Toast state
  const [toast, setToast] = useState(null); // { type: "success"|"error", message }

  /* ─────────────────── helpers ─────────────────── */

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  /* ─────────────────── fetch ─────────────────── */

  useEffect(() => {
    getUsers()
      .then((data) => {
        if (data.success) setUsers(data.data);
        else showToast("error", "Failed to load users.");
      })
      .catch(() => showToast("error", "Server unreachable."))
      .finally(() => setLoading(false));
  }, []);

  /* ─────────────────── derived ─────────────────── */

  const filteredUsers = users.filter((user) =>
    user.full_name.toLowerCase().includes(search.toLowerCase())
  );

  const activeUsers = users.filter((u) => u.status === "active").length;
  const inactiveUsers = users.length - activeUsers;

  /* ─────────────────── handlers ─────────────────── */

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    const res = await deleteUser(id);

    if (!res.success) {
      showToast("error", res.message || "Failed to delete user.");
      return;
    }

    setUsers((prev) => prev.filter((u) => u.user_id !== Number(id)));
    showToast("success", "User deleted.");
  };

  const handleToggleStatus = async (id) => {
    const res = await toggleUserStatus(id);

    if (!res.success) {
      showToast("error", res.message || "Failed to update status.");
      return;
    }

    setUsers((prev) =>
      prev.map((u) => (u.user_id === Number(id) ? res.data : u))
    );
    showToast("success", `User status set to ${res.data.status}.`);
  };

  const handleEditSave = async ({ id, full_name }) => {
    if (!full_name.trim()) return;

    const res = await updateUser(id, { full_name });

    if (!res.success) {
      showToast("error", res.message || "Failed to update user.");
      return;
    }

    setUsers((prev) =>
      prev.map((u) => (u.user_id === Number(id) ? res.data : u))
    );
    setEditModal({ open: false, user: null });
    showToast("success", "User updated.");
  };

  const handleAddUser = async (formData) => {
    const res = await createUser(formData);

    if (!res.success) {
      showToast("error", res.message || "Failed to create user.");
      return;
    }

    setUsers((prev) => [...prev, res.data]);
    setAddModal(false);
    showToast("success", "User created.");
  };

  /* ─────────────────── render ─────────────────── */

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
      <AdminSidebar PATH={PATH} />

      <main className="flex-1 relative">
        {/* TOAST */}
        {toast && (
          <div
            className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl shadow-lg text-white text-sm font-medium transition-all ${
              toast.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle size={16} />
            ) : (
              <AlertCircle size={16} />
            )}
            {toast.message}
          </div>
        )}

        {/* HEADER */}
        <div className="sticky top-0 z-20 backdrop-blur-xl bg-white/70 border-b border-white/40">
          <div className="py-4 sm:h-20 px-4 sm:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                User Management
              </h1>
              <p className="text-sm text-slate-500">
                Manage customers, owners, and administrators
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-2.5 text-slate-400"
                />
                <input
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full sm:w-72 rounded-2xl bg-white/80 border border-slate-200 shadow-sm focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
            <button
              onClick={() => setAddModal(true)}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white px-5 py-2.5 rounded-2xl shadow hover:scale-[1.02] transition btn-press"
            >
              <Plus size={18} />
              Add User
            </button>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-8 space-y-8">
          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <Reveal delay={0}>
              <StatCard
                title="Total Users"
                value={users.length}
                icon={<Users size={20} />}
                color="from-blue-500 to-blue-400"
              />
            </Reveal>
            <Reveal delay={80}>
              <StatCard
                title="Active"
                value={activeUsers}
                icon={<UserCheck size={20} />}
                color="from-green-500 to-green-400"
              />
            </Reveal>
            <Reveal delay={160}>
              <StatCard
                title="Inactive / Banned"
                value={inactiveUsers}
                icon={<UserX size={20} />}
                color="from-red-500 to-red-400"
              />
            </Reveal>
          </div>

          {/* USER GRID */}
          <Reveal className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl shadow-sm">
            <div className="flex justify-between items-center p-6 border-b border-white/30">
              <h2 className="font-semibold text-lg">Users</h2>
              <span className="text-sm text-slate-500">
                {filteredUsers.length} results
              </span>
            </div>

            <div className="p-6">
              {loading ? (
                <p className="text-center text-slate-400 py-12">Loading...</p>
              ) : filteredUsers.length === 0 ? (
                <p className="text-center text-slate-400 py-12">
                  No users found.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filteredUsers.map((user, i) => (
                    <Reveal key={user.user_id} delay={Math.min(i, 8) * 60}>
                      <UserCard
                        user={user}
                        onEdit={() => setEditModal({ open: true, user })}
                        onToggle={() => handleToggleStatus(user.user_id)}
                        onDelete={() => handleDelete(user.user_id)}
                      />
                    </Reveal>
                  ))}
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </main>

      {/* EDIT MODAL */}
      {editModal.open && (
        <EditUserModal
          user={editModal.user}
          onClose={() => setEditModal({ open: false, user: null })}
          onSave={handleEditSave}
        />
      )}

      {/* ADD MODAL */}
      {addModal && (
        <AddUserModal
          onClose={() => setAddModal(false)}
          onSave={handleAddUser}
        />
      )}
    </div>
  );
}

/* ════════════════════════════════════════
   USER CARD
════════════════════════════════════════ */

function UserCard({ user, onEdit, onToggle, onDelete }) {
  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition card-hover">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-500 text-white flex items-center justify-center font-bold text-lg">
            {user.full_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">{user.full_name}</h3>
            <p className="text-xs text-slate-500">#{user.user_id}</p>
          </div>
        </div>
        <StatusDot status={user.status} />
      </div>

      {/* INFO */}
      <div className="mt-4 space-y-2 text-sm text-slate-600">
        <p className="truncate">📧 {user.email}</p>
        <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-xs">
          {user.role}
        </span>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-2 mt-5">
        <ActionButton
          icon={<Pencil size={16} />}
          color="blue"
          title="Edit"
          onClick={onEdit}
        />
        <ActionButton
          icon={<Ban size={16} />}
          color="yellow"
          title={user.status === "active" ? "Ban user" : "Unban user"}
          onClick={onToggle}
        />
        <ActionButton
          icon={<Trash2 size={16} />}
          color="red"
          title="Delete"
          onClick={onDelete}
        />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   EDIT MODAL
════════════════════════════════════════ */

function EditUserModal({ user, onClose, onSave }) {
  const [fullName, setFullName] = useState(user.full_name);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!fullName.trim()) return;
    setSaving(true);
    await onSave({ id: user.user_id, full_name: fullName });
    setSaving(false);
  };

  return (
    <Modal title="Edit User" onClose={onClose}>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        Full Name
      </label>
      <input
        className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm btn-press"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="px-5 py-2 rounded-xl bg-teal-600 text-white text-sm hover:bg-teal-700 disabled:opacity-50 btn-press"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </Modal>
  );
}

/* ════════════════════════════════════════
   ADD USER MODAL
════════════════════════════════════════ */

function AddUserModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "customer",
  });
  const [saving, setSaving] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.full_name || !form.email || !form.password) return;
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <Modal title="Add User" onClose={onClose}>
      <div className="space-y-4">
        <Field label="Full Name">
          <input
            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none"
            value={form.full_name}
            onChange={set("full_name")}
            placeholder="Jane Doe"
          />
        </Field>
        <Field label="Email">
          <input
            type="email"
            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none"
            value={form.email}
            onChange={set("email")}
            placeholder="jane@example.com"
          />
        </Field>
        <Field label="Password">
          <input
            type="password"
            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none"
            value={form.password}
            onChange={set("password")}
            placeholder="••••••••"
          />
        </Field>
        <Field label="Role">
          <select
            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none bg-white"
            value={form.role}
            onChange={set("role")}
          >
            <option value="customer">Customer</option>
            <option value="driver">Driver</option>
            <option value="admin">Admin</option>
            <option value="restaurant_owner">Owner</option>
          </select>
        </Field>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm btn-press"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="px-5 py-2 rounded-xl bg-teal-600 text-white text-sm hover:bg-teal-700 disabled:opacity-50 btn-press"
        >
          {saving ? "Creating…" : "Create User"}
        </button>
      </div>
    </Modal>
  );
}

/* ════════════════════════════════════════
   SHARED COMPONENTS
════════════════════════════════════════ */

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-7 relative animate-fade-in-scale">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition btn-press"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-sm hover:scale-[1.02] transition card-hover">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
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

function StatusDot({ status }) {
  return (
    <span
      title={status}
      className={`w-3 h-3 rounded-full ${
        status === "active" ? "bg-green-500" : "bg-red-400"
      }`}
    />
  );
}

function ActionButton({ icon, color, title, onClick }) {
  const styles = {
    blue: "bg-blue-50 text-blue-600 hover:bg-blue-100",
    yellow: "bg-yellow-50 text-yellow-700 hover:bg-yellow-100",
    red: "bg-red-50 text-red-600 hover:bg-red-100",
  };

  return (
    <button
      title={title}
      onClick={onClick}
      className={`w-9 h-9 rounded-xl flex items-center justify-center transition btn-press ${styles[color]}`}
    >
      {icon}
    </button>
  );
}