import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const RevenueChart = ({ data = [] }) => (
  <div className="card-hover bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm space-y-4">
    <div>
      <h4 className="text-sm font-bold text-gray-800">Hourly Revenue Stream</h4>
      <p className="text-xs text-gray-400 mt-0.5">Today's gross revenue by hour.</p>
    </div>
    <div className="h-64 w-full pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} tickLine={false} />
          <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }} 
          />
          <Area type="monotone" dataKey="sales" stroke="#004D40" strokeWidth={2} fillOpacity={0.1} fill="#004D40" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default RevenueChart;