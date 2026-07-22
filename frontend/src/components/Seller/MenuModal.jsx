import React from 'react';
import { X, DollarSign, ImagePlus } from 'lucide-react';

const MenuModal = ({ isOpen, onClose, onSubmit, formData, setFormData, categories }) => {
  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    setFormData({
      ...formData,
      image: file,
      imagePreview: file ? URL.createObjectURL(file) : formData.imagePreview,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl p-6 space-y-4 animate-fade-in-scale max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900">Add Menu Item</h3>
          <button type="button" onClick={onClose} className="btn-press text-gray-400 hover:text-gray-700 cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-teal-900 mb-1.5 uppercase tracking-wider">Item Image</label>
            <label className="flex items-center gap-3 border border-dashed border-gray-300 rounded-xl p-3 cursor-pointer hover:bg-gray-50 transition">
              {formData.imagePreview ? (
                <img src={formData.imagePreview} alt="Preview" className="w-14 h-14 rounded-xl object-cover shrink-0" />
              ) : (
                <ImagePlus className="text-gray-400 shrink-0" size={28} />
              )}
              <span className="text-xs text-gray-400">Click to upload a photo</span>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-teal-900 mb-1.5 uppercase tracking-wider">Item Name</label>
            <input type="text" required placeholder="e.g., Blueberry Blast" className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#004D40]" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-teal-900 mb-1.5 uppercase tracking-wider">Base Price</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 text-gray-400" size={14} />
                <input type="number" step="0.01" required placeholder="3.50" className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#004D40]" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-teal-900 mb-1.5 uppercase tracking-wider">Category</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-[#004D40]" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} >
                {categories.filter(c => c.id !== 'all').map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-teal-900 mb-1.5 uppercase tracking-wider">Description</label>
            <textarea rows="3" placeholder="Describe ingredients, allergy alerts..." className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#004D40] resize-none" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={onClose} className="btn-press px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-xl cursor-pointer">Cancel</button>
            <button type="submit" className="btn-press px-5 py-2 text-sm font-bold bg-[#004D40] text-white rounded-xl shadow-md cursor-pointer">Save Item</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenuModal;