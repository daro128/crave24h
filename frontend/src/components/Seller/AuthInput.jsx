import React from 'react';

const AuthInput = ({ label, type = 'text', placeholder, value, onChange, icon: Icon, required = true }) => {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-teal-900 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-3 text-gray-400">
            <Icon size={16} />
          </div>
        )}
        <input
          type={type}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#004D40] transition-all bg-white ${
            Icon ? 'pl-10' : 'px-4'
          }`}
        />
      </div>
    </div>
  );
};

export default AuthInput;