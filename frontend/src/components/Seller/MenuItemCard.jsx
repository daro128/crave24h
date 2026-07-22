import React from 'react';
import { Trash2, Plus, ImageOff } from 'lucide-react';

const UPLOADS_URL = "http://localhost:5000/uploads";

const MenuItemCard = ({ item, onToggleStatus, onDeleteItem, onRestockItem }) => {
  const isAvailable = item.status === 'available';

  return (
    <div className={`card-hover bg-white border rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between transition-all ${
      isAvailable ? 'border-gray-200/90' : 'border-gray-200 bg-gray-50/40 opacity-75'
    }`}>
      <div className="p-5 space-y-3">
        <div className="flex justify-between items-start gap-4">
          {item.image ? (
            <img
              src={`${UPLOADS_URL}/${item.image}`}
              alt={item.product_name}
              className="w-14 h-14 rounded-xl object-cover shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
              <ImageOff className="text-gray-300" size={20} />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-gray-800 text-base">{item.product_name}</h4>
            <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
          </div>
          <span className="text-base font-black text-[#004D40] bg-teal-50/60 px-2.5 py-1 rounded-xl shrink-0">
            ${Number(item.price).toFixed(2)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-lg w-fit ${
            item.stock > 0 ? 'text-gray-600 bg-gray-100' : 'text-red-600 bg-red-50'
          }`}>
            Stock: {item.stock ?? 0}
          </span>
          <button
            type="button"
            onClick={() => onRestockItem(item.product_id)}
            title="Restock +10"
            className="btn-press flex items-center gap-1 text-xs font-bold text-[#004D40] bg-teal-50/60 hover:bg-teal-100 px-2 py-1 rounded-lg transition-colors cursor-pointer"
          >
            <Plus size={12} /> 10
          </button>
        </div>
      </div>

      <div className="bg-gray-50/60 px-5 py-3 border-t border-gray-100 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onToggleStatus(item.product_id)}
            className={`btn-press w-10 h-5 rounded-full transition-colors relative cursor-pointer outline-none ${
              isAvailable ? 'bg-[#004D40]' : 'bg-gray-300'
            }`}
          >
            <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${
              isAvailable ? 'left-6' : 'left-0.5'
            }`} />
          </button>
          <span className="text-xs font-bold text-gray-500">
            {isAvailable ? 'Available' : 'Sold Out'}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onDeleteItem(item.product_id)}
          className="btn-press text-gray-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
};

export default MenuItemCard;