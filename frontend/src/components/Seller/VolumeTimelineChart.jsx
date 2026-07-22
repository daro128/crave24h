import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const VolumeTimelineChart = ({ data = [] }) => (
  <div className="card-hover bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm space-y-4 flex-1">
    <div>
      <h4 className="text-sm font-bold text-gray-800">Weekly Revenue Volume</h4>
      <p className="text-xs text-gray-400 mt-0.5">Daily gross revenue over the last 7 days.</p>
    </div>
    <div className="h-64 w-full pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
          <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
          <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
          <Bar dataKey="revenue" fill="#004D40" radius={[4, 4, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default VolumeTimelineChart;