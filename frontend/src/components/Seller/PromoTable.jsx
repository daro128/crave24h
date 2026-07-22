import React from 'react';

const formatDateRange = (start, end) => {
  const options = { month: 'short', day: 'numeric', timeZone: 'UTC' };
  return `${new Date(start).toLocaleDateString('en-US', options)} - ${new Date(end).toLocaleDateString('en-US', options)}`;
};

const PromoTable = ({ campaigns }) => (
  <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm overflow-hidden">
    <div className="overflow-x-auto">
      <div className="min-w-160">
        <div className="bg-gray-50/70 border-b border-gray-100 px-6 py-4 grid grid-cols-4 text-xs font-black text-gray-400 uppercase tracking-wider">
          <div>Offer / Code</div>
          <div>Status</div>
          <div>Performance</div>
          <div className="text-right">Timeline</div>
        </div>

        {campaigns.length === 0 ? (
          <p className="text-center text-gray-400 py-10 text-sm">No campaigns yet.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {campaigns.map((promo) => (
              <div key={promo.promotion_id} className="px-6 py-4.5 grid grid-cols-4 items-center hover:bg-gray-50/60 transition-colors text-sm">
                <div>
                  <h5 className="font-bold text-gray-800">{promo.name}</h5>
                  <span className="text-xs font-mono font-bold text-[#004D40] bg-teal-50 px-1.5 py-0.5 rounded mt-1 inline-block uppercase tracking-wide">
                    {promo.code} • {promo.discount_percent}% off
                  </span>
                </div>
                <div>
                  <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wider border ${
                    promo.status === 'Active'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                      : 'bg-amber-50 text-amber-700 border-amber-100'
                  }`}>
                    {promo.status}
                  </span>
                </div>
                <div className="text-gray-600 font-medium">
                  {promo.status === 'Scheduled' ? 'Starts Soon' : `${promo.redemptions} Redemptions`}
                </div>
                <div className="text-right font-medium text-gray-500 text-xs">
                  {formatDateRange(promo.start_date, promo.end_date)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);

export default PromoTable;