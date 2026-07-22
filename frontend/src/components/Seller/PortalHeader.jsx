import { useEffect, useState } from 'react';
import { Bell, Menu } from 'lucide-react';
import { getProfile } from '../../api/sellerApi';

const PortalHeader = ({ onMenuClick = () => {} }) => {
  const [restaurant, setRestaurant] = useState({ restaurant_name: '', status: 'open' });
  const user = JSON.parse(localStorage.getItem('user') ?? 'null');

  useEffect(() => {
    const load = async () => {
      const res = await getProfile();
      if (res.success) {
        setRestaurant({ restaurant_name: res.data.restaurant_name, status: res.data.status });
      }
    };
    load();
  }, []);

  const isOpen = restaurant.status === 'open';
  const fullName = user?.full_name ?? 'Store Manager';
  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="h-16 bg-white border-b border-gray-100 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">

      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="btn-press lg:hidden p-2 -ml-2 rounded-lg text-slate-500 hover:bg-gray-50 shrink-0"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <h2 className="text-lg font-bold text-slate-800 truncate">{restaurant.restaurant_name}</h2>
        <span
          className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 border ${
            isOpen
              ? 'text-teal-700 bg-teal-50 border-teal-100'
              : 'text-rose-700 bg-rose-50 border-rose-100'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-teal-500' : 'bg-rose-500'}`}></span>
          {isOpen ? 'Open' : 'Closed'}
        </span>
      </div>

      <div className="flex items-center gap-4">

        <button type="button" className="text-gray-400 hover:text-gray-600 relative p-2 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
          <Bell size={18} className="text-gray-400" />
          <span className="w-2 h-2 bg-rose-500 rounded-full absolute top-1.5 right-1.5 border border-white" />
        </button>

        <div className="w-px h-6 bg-gray-200" />

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-sm font-bold text-slate-800 block leading-none">{fullName}</span>
            <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider block mt-1">
              Store Manager
            </span>
          </div>
          <div
            className="w-9 h-9 rounded-full border border-gray-100 shadow-sm bg-teal-50 text-teal-700 text-xs font-bold flex items-center justify-center shrink-0"
            aria-label={`${fullName} Profile Avatar`}
          >
            {initials}
          </div>
        </div>

      </div>

    </header>
  );
};

export default PortalHeader;