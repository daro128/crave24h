import { UPLOADS_URL } from "../../config";
import { useEffect, useState } from "react";
import {
  Search,
  Store,
  Users,
  CircleCheck,
  Pencil,
  Trash2,
  Plus,
  X,
} from "lucide-react";

import AdminSidebar from "../../components/admin/AdminSidebar";
import Reveal from "../../components/common/Reveal";
import { PATH } from "../../path";



import {
  getRestaurants,
  deleteRestaurant,
  createRestaurant,
  updateRestaurant,
  getUsers,
} from "../../api/adminApi";

export default function AdminRestaurantManagement() {
  const [restaurants, setRestaurants] = useState([]);
  const [owners, setOwners] = useState([]);
  const [search, setSearch] = useState("");

  // modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const emptyForm = {
    restaurant_name: "",
    user_id: "",
    category_id: "",
    description: "",
    address: "",
    phone: "",
    status: "open",
    logo: null,
    image: null,
  };

  const [form, setForm] = useState(emptyForm);
  const [logoPreview, setLogoPreview] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingLogo, setExistingLogo] = useState(null);
  const [existingImage, setExistingImage] = useState(null);

  /* ================= FETCH ================= */
  useEffect(() => {
    const load = async () => {
      const [restRes, userRes] = await Promise.all([
        getRestaurants(),
        getUsers(),
      ]);

      setRestaurants(restRes.data || []);

      // only restaurant_owner role can be assigned
      const ownerList = (userRes.data || []).filter(
        (u) => u.role === "restaurant_owner"
      );
      setOwners(ownerList);
    };

    load();
  }, []);

  /* ================= FILTER ================= */
  const filteredRestaurants = restaurants.filter((r) =>
    (r.restaurant_name || "").toLowerCase().includes(search.toLowerCase())
  );

  const activeRestaurants = restaurants.filter(
    (r) => r.status === "open"
  ).length;

  /* ================= INPUT CHANGE ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files?.[0] || null;
    setForm({ ...form, [name]: file });

    const previewUrl = file ? URL.createObjectURL(file) : null;
    if (name === "logo") setLogoPreview(previewUrl);
    if (name === "image") setImagePreview(previewUrl);
  };

  /* ================= OPEN ADD ================= */
  const openAddModal = () => {
    setEditMode(false);
    setSelectedRestaurant(null);
    setForm(emptyForm);
    setLogoPreview(null);
    setImagePreview(null);
    setExistingLogo(null);
    setExistingImage(null);
    setIsModalOpen(true);
  };

  /* ================= OPEN EDIT ================= */
  const openEditModal = (r) => {
    setEditMode(true);
    setSelectedRestaurant(r);
    setForm({
      restaurant_name: r.restaurant_name || "",
      user_id: r.user_id || "",
      category_id: r.category_id || "",
      description: r.description || "",
      address: r.address || "",
      phone: r.phone || "",
      status: r.status || "open",
      logo: null,
      image: null,
    });
    setLogoPreview(null);
    setImagePreview(null);
    setExistingLogo(r.logo || null);
    setExistingImage(r.image || null);
    setIsModalOpen(true);
  };

  /* ================= SAVE (ADD / EDIT) ================= */
  const handleSave = async () => {
    if (!form.restaurant_name.trim() || !form.user_id || !form.category_id) {
      return;
    }

    try {
      const payload = {
        restaurant_name: form.restaurant_name,
        description: form.description,
        address: form.address,
        phone: form.phone,
        user_id: Number(form.user_id),
        category_id: Number(form.category_id),
        status: form.status,
        ...(form.logo && { logo: form.logo }),
        ...(form.image && { image: form.image }),
      };

      let res;

      if (editMode) {
        res = await updateRestaurant(selectedRestaurant.restaurant_id, payload);
      } else {
        res = await createRestaurant(payload);
      }

      const data = res?.data;

      if (!res.success || !data) {
        console.log("Save failed:", res);
        return;
      }

      setRestaurants((prev) => {
        if (editMode) {
          return prev.map((r) =>
            r.restaurant_id === selectedRestaurant.restaurant_id ? data : r
          );
        } else {
          return [...prev, data];
        }
      });

      setIsModalOpen(false);
      setEditMode(false);
      setSelectedRestaurant(null);
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete restaurant?")) return;

    try {
      const res = await deleteRestaurant(id);
      if (res.success !== false) {
        setRestaurants((prev) => prev.filter((r) => r.restaurant_id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
      <AdminSidebar PATH={PATH} />

      <main className="flex-1">
        {/* HEADER */}
        <div className="sticky top-0 z-20 backdrop-blur-xl bg-white/70 border-b border-white/40">
          <div className="py-4 sm:h-20 px-4 sm:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Restaurant Operations
              </h1>
              <p className="text-sm text-slate-500">Manage partner restaurants</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-2.5 text-slate-400"
                />
                <input
                  placeholder="Search restaurant..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full sm:w-72 rounded-2xl bg-white/80 border border-slate-200 shadow-sm focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              {/* ADD BUTTON */}
              <button
                onClick={openAddModal}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white px-5 py-2.5 rounded-2xl shadow hover:scale-[1.02] transition btn-press"
              >
                <Plus size={18} />
                Add Restaurant
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-8 space-y-8">
          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <Reveal delay={0}>
              <StatCard
                title="Restaurants"
                value={restaurants.length}
                icon={<Store size={20} />}
                color="from-orange-500 to-orange-400"
              />
            </Reveal>
            <Reveal delay={80}>
              <StatCard
                title="Owners"
                value={owners.length}
                icon={<Users size={20} />}
                color="from-blue-500 to-blue-400"
              />
            </Reveal>
            <Reveal delay={160}>
              <StatCard
                title="Active"
                value={activeRestaurants}
                icon={<CircleCheck size={20} />}
                color="from-green-500 to-green-400"
              />
            </Reveal>
          </div>

          {/* LIST */}
          <Reveal className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl shadow-sm">
            <div className="flex justify-between items-center p-6 border-b border-white/30">
              <h2 className="font-semibold text-lg">Restaurant List</h2>
              <span className="text-sm text-slate-500">
                {filteredRestaurants.length} results
              </span>
            </div>

            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredRestaurants.length === 0 ? (
                <p className="text-slate-400 col-span-full text-center py-12">
                  No restaurants found.
                </p>
              ) : (
                filteredRestaurants.map((r, i) => (
                  <Reveal
                    key={r.restaurant_id}
                    delay={Math.min(i, 8) * 60}
                    className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition card-hover"
                  >
                    {/* TOP */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {r.logo ? (
                          <img
                            src={`${UPLOADS_URL}/${r.logo}`}
                            alt={r.restaurant_name}
                            className="w-12 h-12 rounded-2xl object-cover shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-400 text-white flex items-center justify-center font-bold shrink-0">
                            {r.restaurant_name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-slate-800">
                            {r.restaurant_name}
                          </h3>
                          <p className="text-xs text-slate-500">
                            ID #{r.restaurant_id}
                          </p>
                        </div>
                      </div>
                      <StatusDot status={r.status} />
                    </div>

                    {/* BODY */}
                    <div className="mt-4 space-y-2 text-sm text-slate-600">
                      <p>👤 {r.User?.full_name ?? "—"}</p>
                      <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-xs">
                        {r.Category?.category_name ?? "—"}
                      </span>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex justify-end gap-2 mt-5">
                      <ActionButton
                        icon={<Pencil size={16} />}
                        color="blue"
                        onClick={() => openEditModal(r)}
                      />
                      <ActionButton
                        icon={<Trash2 size={16} />}
                        color="red"
                        onClick={() => handleDelete(r.restaurant_id)}
                      />
                    </div>
                  </Reveal>
                ))
              )}
            </div>
          </Reveal>
        </div>

        {/* MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-[480px] rounded-3xl p-7 shadow-xl relative animate-fade-in-scale max-h-[90vh] overflow-y-auto">
              {/* MODAL HEADER */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-800">
                  {editMode ? "Edit Restaurant" : "Add Restaurant"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 transition btn-press"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-3">
                {/* LOGO + IMAGE */}
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Logo">
                    <label className="flex flex-col items-center justify-center gap-2 border border-dashed border-slate-300 rounded-xl p-3 cursor-pointer hover:bg-slate-50 transition">
                      {logoPreview || existingLogo ? (
                        <img
                          src={logoPreview || `${UPLOADS_URL}/${existingLogo}`}
                          alt="Logo preview"
                          className="w-16 h-16 rounded-xl object-cover"
                        />
                      ) : (
                        <span className="text-xs text-slate-400 text-center">
                          Click to upload logo
                        </span>
                      )}
                      <input
                        type="file"
                        name="logo"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </Field>

                  <Field label="Cover Image">
                    <label className="flex flex-col items-center justify-center gap-2 border border-dashed border-slate-300 rounded-xl p-3 cursor-pointer hover:bg-slate-50 transition">
                      {imagePreview || existingImage ? (
                        <img
                          src={imagePreview || `${UPLOADS_URL}/${existingImage}`}
                          alt="Cover preview"
                          className="w-16 h-16 rounded-xl object-cover"
                        />
                      ) : (
                        <span className="text-xs text-slate-400 text-center">
                          Click to upload image
                        </span>
                      )}
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </Field>
                </div>

                {/* NAME */}
                <Field label="Restaurant Name">
                  <input
                    name="restaurant_name"
                    value={form.restaurant_name}
                    onChange={handleChange}
                    placeholder="e.g. Golden Dragon"
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </Field>

                {/* OWNER */}
                <Field label="Owner">
                  <select
                    name="user_id"
                    value={form.user_id}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none bg-white"
                  >
                    <option value="">Select owner…</option>
                    {owners.map((o) => (
                      <option key={o.user_id} value={o.user_id}>
                        {o.full_name} — {o.email}
                      </option>
                    ))}
                  </select>
                  {owners.length === 0 && (
                    <p className="text-xs text-slate-400 mt-1">
                      No users with the "restaurant_owner" role found.
                    </p>
                  )}
                </Field>

                {/* CATEGORY */}
                <Field label="Category">
                  <select
                    name="category_id"
                    value={form.category_id}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none bg-white"
                  >
                    <option value="">Select category…</option>
                    <option value="1">Fast Food</option>
                    <option value="2">Coffee</option>
                    <option value="3">Asian</option>
                  </select>
                </Field>

                {/* DESCRIPTION */}
                <Field label="Description">
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Short description"
                    rows={2}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none resize-none"
                  />
                </Field>

                {/* ADDRESS */}
                <Field label="Address">
                  <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="123 Main St"
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </Field>

                {/* PHONE */}
                <Field label="Phone">
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+855 12 345 678"
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </Field>

                {/* STATUS */}
                <Field label="Status">
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none bg-white"
                  >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                  </select>
                </Field>
              </div>

              {/* BUTTONS */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm btn-press"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-5 py-2 rounded-xl bg-teal-600 text-white text-sm hover:bg-teal-700 transition btn-press"
                >
                  {editMode ? "Save Changes" : "Create Restaurant"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/* ================= SHARED COMPONENTS ================= */

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
        status === "open" ? "bg-green-500" : "bg-yellow-400"
      }`}
    />
  );
}

function ActionButton({ icon, color, onClick }) {
  const styles = {
    blue: "bg-blue-50 text-blue-600 hover:bg-blue-100",
    red: "bg-red-50 text-red-600 hover:bg-red-100",
  };

  return (
    <button
      onClick={onClick}
      className={`w-9 h-9 rounded-xl flex items-center justify-center transition btn-press ${styles[color]}`}
    >
      {icon}
    </button>
  );
}