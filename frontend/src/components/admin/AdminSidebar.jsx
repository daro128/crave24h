import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Store,
  Bike,
  UserCircle,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../common/Logo";


export default function AdminSidebar({ PATH }) {

  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menus = [
    {
      title: "GENERAL",
      items: [
        { name: "Dashboard",   path: PATH.ADMIN.DASHBOARD,  icon: LayoutDashboard },
        { name: "Users",       path: PATH.ADMIN.USERS,       icon: Users },
        { name: "Restaurants", path: PATH.ADMIN.RESTAURANTS, icon: Store },
        { name: "Deliveries",  path: PATH.ADMIN.DELIVERIES,  icon: Bike },
      ],
    },
    {
      title: "ACCOUNT",
      items: [
        { name: "Profile", path: PATH.ADMIN.PROFILE, icon: UserCircle },
      ],
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/auth/login");
  };

  return (
    <>
      {/* MOBILE TOGGLE */}
      <button
        onClick={() => setMobileOpen(true)}
        className="btn-press lg:hidden fixed top-4 left-4 z-40 p-2.5 rounded-xl bg-white shadow-md text-slate-600"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`w-64 bg-[#F8FAFC] h-screen flex flex-col px-5 py-8 fixed inset-y-0 left-0 z-50 transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="mb-12 flex items-center justify-between">
          <div>
            <Logo to={PATH.ADMIN.DASHBOARD} />
            <p className="text-xs text-slate-500 mt-1 ml-11">Admin Panel</p>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="btn-press lg:hidden p-2 rounded-lg text-slate-400 hover:bg-slate-100"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Menu */}
        <div className="flex-1">
          {menus.map((section) => (
            <div key={section.title} className="mb-8">
              <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-3 px-3">
                {section.title}
              </p>

              <div className="space-y-1">
                {section.items.map((menu) => {
                  const Icon = menu.icon;
                  return (
                    <NavLink
                      key={menu.name}
                      to={menu.path}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                          isActive
                            ? "bg-[#004953] text-white shadow-sm"
                            : "text-slate-500 hover:bg-white hover:text-slate-900"
                        }`
                      }
                    >
                      <Icon size={19} />
                      <span className="font-medium">{menu.name}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="btn-press flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-white hover:text-red-500 transition"
        >
          <LogOut size={19} />
          Logout
        </button>

      </aside>
    </>
  );
}
