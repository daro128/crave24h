import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#004D40', '#0ea5e9', '#f59e0b', '#a855f7', '#ef4444', '#10b981'];

const SalesMixChart = ({ data = [] }) => (
  <div className="card-hover bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm space-y-4 lg:w-96">
    <div>
      <h4 className="text-sm font-bold text-gray-800">Product Category Mix</h4>
      <p className="text-xs text-gray-400 mt-0.5">Revenue share by category over the last 30 days.</p>
    </div>
    <div className="h-64 w-full flex items-center justify-center">
      {data.length === 0 ? (
        <p className="text-xs text-gray-400">No sales in the last 30 days.</p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', fontSize: '12px' }} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
            <Pie data={data} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  </div>
);

export default SalesMixChart;