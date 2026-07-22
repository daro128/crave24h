import React from 'react';

const CategoryTabs = ({ activeCategory, setActiveCategory, categories }) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      {categories.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => setActiveCategory(cat.id)}
          className={`btn-press px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeCategory === cat.id
              ? 'bg-[#004D40] text-white shadow-sm'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;