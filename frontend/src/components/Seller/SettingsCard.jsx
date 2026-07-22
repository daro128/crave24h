import React from 'react';

const SettingsCard = ({ title, description, icon: Icon, children }) => (
  <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm overflow-hidden">
    <div className="p-5 border-b border-gray-100 bg-gray-50/40 flex items-start gap-3.5">
      {Icon && (
        <div className="p-2 bg-teal-50 text-[#004D40] rounded-xl shrink-0">
          <Icon size={18} />
        </div>
      )}
      <div>
        <h4 className="text-sm font-bold text-gray-800">{title}</h4>
        <p className="text-xs text-gray-400 mt-0.5">{description}</p>
      </div>
    </div>
    <div className="p-6 space-y-5">
      {children}
    </div>
  </div>
);

export default SettingsCard;