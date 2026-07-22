import React from 'react';
import { LayoutDashboard, ShoppingBag, Utensils, BarChart3, Megaphone, Star, Settings, HelpCircle, LogOut, X } from 'lucide-react';
import { PATH } from '../../path.js';
import SidebarLink from './SidebarLink';
import Logo from '../common/Logo';

const PortalSidebar = ({ mobileOpen = false, onClose = () => {} }) => {
  const navItems = [
    { to: PATH.SELLER.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { to: PATH.SELLER.ORDERS, label: 'Orders', icon: ShoppingBag },
    { to: PATH.SELLER.MENU, label: 'Menu', icon: Utensils },
    { to: PATH.SELLER.ANALYTICS, label: 'Analytics', icon: BarChart3 },
    { to: PATH.SELLER.PROMOTIONS, label: 'Promotions', icon: Megaphone },
    { to: PATH.SELLER.REVIEWS, label: 'Reviews', icon: Star },
    { to: PATH.SELLER.SETTINGS, label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40"
          onClick={onClose}
        />
      )}

      <aside
        className={`w-64 h-screen bg-white border-r border-gray-100 flex flex-col justify-between shrink-0 select-none fixed top-0 left-0 z-50 transition-transform duration-300 overflow-y-auto
        lg:sticky lg:translate-x-0 lg:z-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
      <div className="p-6 space-y-8">

        {/* Branding */}
        <div className="px-2 pt-2 flex items-center justify-between">
          <div>
            <Logo to={PATH.SELLER.DASHBOARD} />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mt-0.5 ml-11">
              Partner Portal
            </span>
          </div>
          <button
            onClick={onClose}
            className="btn-press lg:hidden p-2 rounded-lg text-slate-400 hover:bg-slate-100"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Dynamic Navigation Stack */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <SidebarLink key={item.to} to={item.to} label={item.label} icon={item.icon} onClick={onClose} />
          ))}
        </nav>
      </div>

      {/* Bottom Action Footer Row from image_86ad87.png */}
      <div className="p-6 space-y-0.5">
        <button
          type="button"
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:bg-gray-50 hover:text-slate-900 transition-all cursor-pointer"
        >
          <HelpCircle size={18} />
          <span>Help</span>
        </button>

        <button
          type="button"
          onClick={() => {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("role");
            localStorage.removeItem("user");
            window.location.reload();
          }}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:bg-rose-50 hover:text-rose-500 transition-all cursor-pointer"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
      </aside>
    </>
  );
};

export default PortalSidebar;