import React from 'react';
import { NavLink } from 'react-router-dom';

const SidebarLink = ({ to, label, icon: Icon, onClick }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
          isActive
            ? 'bg-[#004953] text-white shadow-sm'
            : 'text-slate-500 hover:bg-gray-50 hover:text-slate-900'
        }`
      }
    >
      <Icon size={19} />
      <span className="font-medium">{label}</span>
    </NavLink>
  );
};

export default SidebarLink;