'use client';
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function FunnelChart({ data }) {
  const [selectedFunnel, setSelectedFunnel] = useState('signup');
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Funnel Analysis</h2>
        <select 
          value={selectedFunnel} 
          onChange={(e) => setSelectedFunnel(e.target.value)}
          className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="signup">Signup Funnel</option>
          <option value="purchase">Purchase Funnel</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data[selectedFunnel]}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="step" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="users" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 grid grid-cols-5 gap-2">
        {data[selectedFunnel].map((step, i) => (
          <div key={i} className="text-center">
            <p className="text-xs text-gray-500">{step.step}</p>
            <p className="text-sm font-semibold text-gray-900">{step.rate}%</p>
            {i > 0 && (
              <p className="text-xs text-red-600">
                -{(data[selectedFunnel][i-1].rate - step.rate).toFixed(1)}%
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
