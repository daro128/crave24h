import React from 'react';
import { X, Tag } from 'lucide-react';

const PromoModal = ({ isOpen, onClose, onSubmit, formData, setFormData }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl p-6 space-y-4 animate-fade-in-scale max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900">New Promotion</h3>
          <button type="button" onClick={onClose} className="btn-press text-gray-400 hover:text-gray-700 cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-teal-900 mb-1.5 uppercase tracking-wider">Campaign Name</label>
            <input type="text" required placeholder="e.g., Weekend Free Delivery" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#004D40]" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-teal-900 mb-1.5 uppercase tracking-wider">Promo Code</label>
              <div className="relative">
                <Tag className="absolute left-3 top-2.5 text-gray-400" size={14} />
                <input type="text" required placeholder="FREESHIP50" className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-sm font-mono uppercase outline-none focus:ring-2 focus:ring-[#004D40]" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-teal-900 mb-1.5 uppercase tracking-wider">Discount %</label>
              <input type="number" min="1" max="100" required placeholder="15" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#004D40]" value={formData.discountPercent} onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-teal-900 mb-1.5 uppercase tracking-wider">Start Date</label>
              <input type="date" required className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#004D40]" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-bold text-teal-900 mb-1.5 uppercase tracking-wider">End Date</label>
              <input type="date" required min={formData.startDate} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#004D40]" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} />
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={onClose} className="btn-press px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-xl cursor-pointer">Cancel</button>
            <button type="submit" className="btn-press px-5 py-2 text-sm font-bold bg-[#004D40] text-white rounded-xl shadow-md cursor-pointer">Launch Offer</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PromoModal;