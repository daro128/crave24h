import React from 'react';

const OrderFilters = ({ activeFilter, setActiveFilter, counts }) => {
  const filters = [
    { id: 'all', label: 'All Orders', count: counts.all },
    { id: 'pending', label: 'Pending Approval', count: counts.pending },
    { id: 'accepted', label: 'Accepted', count: counts.accepted },
    { id: 'preparing', label: 'In Kitchen', count: counts.preparing },
    { id: 'out_for_delivery', label: 'Out for Delivery', count: counts.out_for_delivery },
  ];

  return (
    <div className="flex flex-wrap gap-2 pb-2">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => setActiveFilter(filter.id)}
          className={`btn-press px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeFilter === filter.id
              ? 'bg-[#004D40] text-white shadow-sm'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          {filter.label}
          <span className={`text-xs px-2 py-0.5 rounded-lg font-black ${
            activeFilter === filter.id 
              ? 'bg-teal-900/40 text-white' 
              : 'bg-gray-100 text-gray-500'
          }`}>
            {filter.count}
          </span>
        </button>
      ))}
    </div>
  );
};

export default OrderFilters;