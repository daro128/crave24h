import React from 'react';

const StoreProfileForm = ({ profile, onChange }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-teal-900 uppercase tracking-wider">Storefront Title</label>
      <input 
        type="text" 
        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#004D40]" 
        value={profile.name} 
        onChange={(e) => onChange('name', e.target.value)} 
      />
    </div>
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-teal-900 uppercase tracking-wider">Contact Number</label>
      <input 
        type="text" 
        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#004D40]" 
        value={profile.phone} 
        onChange={(e) => onChange('phone', e.target.value)} 
      />
    </div>
    <div className="md:col-span-2 space-y-1.5">
      <label className="text-xs font-bold text-teal-900 uppercase tracking-wider">Physical Store Location</label>
      <input 
        type="text" 
        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#004D40]" 
        value={profile.address} 
        onChange={(e) => onChange('address', e.target.value)} 
      />
    </div>
  </div>
);

export default StoreProfileForm;