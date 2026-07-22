// DeliverySideNav.jsx
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Map, Wallet, UserCircle, LogOut, Menu, X } from "lucide-react";
import { PATH } from "../../path.js";

export default function DeliverySideNav() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/auth/login");
  };

  const menus = [
    {
      title: "GENERAL",
      items: [
        { name: "Dashboard", path: PATH.DELIVERY.DASHBOARD, icon: LayoutDashboard },
        { name: "Map",       path: PATH.DELIVERY.MAP,       icon: Map              },
        { name: "Earnings",  path: PATH.DELIVERY.EARNING,   icon: Wallet           },
      ],
    },
    {
      title: "ACCOUNT",
      items: [
        { name: "Profile", path: PATH.DELIVERY.PROFILE, icon: UserCircle },
      ],
    },
  ];

  return (
    <>
      {/* MOBILE TOGGLE */}
      <button
        onClick={() => setMobileOpen(true)}
        className="btn-press lg:hidden fixed top-24 left-4 z-30 p-2.5 rounded-xl bg-white shadow-md text-slate-600"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`w-64 bg-[#F8FAFC] flex flex-col px-5 py-8 fixed top-0 left-0 h-screen z-40 transition-transform duration-300 overflow-y-auto
        lg:sticky lg:top-20 lg:h-[calc(100vh-80px)] lg:translate-x-0 lg:z-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-end lg:hidden mb-4">
          <button
            onClick={() => setMobileOpen(false)}
            className="btn-press p-2 rounded-lg text-slate-400 hover:bg-slate-100"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1">
          {menus.map((section) => (
            <div key={section.title} className="mb-8">
              <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-3 px-3">
                {section.title}
              </p>
              <div className="space-y-1">
                {section.items.map(({ name, path, icon: Icon }) => (
                  <NavLink
                    key={name}
                    to={path}
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
                    <span className="font-medium">{name}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={logout}
          className="btn-press flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-white hover:text-red-500 transition"
        >
          <LogOut size={19} />
          Logout
        </button>
      </aside>
    </>
  );
}
