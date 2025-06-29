'use client';
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function FunnelChart({ funnelData, debugInfo }) {
  const [selectedFunnel, setSelectedFunnel] = useState('homeToDemo');
  
  // Handle case where funnelData might not be loaded yet
  if (!funnelData || Object.keys(funnelData).length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Conversion Funnels</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">Loading funnel data...</p>
        </div>
      </div>
    );
  }

  const funnelOptions = Object.keys(funnelData).map(key => ({
    value: key,
    label: funnelData[key].name || key
  }));
  
  const currentFunnelData = funnelData[selectedFunnel];
  const currentFunnel = currentFunnelData?.steps || [];
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Conversion Funnels</h2>
        <select 
          value={selectedFunnel} 
          onChange={(e) => setSelectedFunnel(e.target.value)}
          className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {funnelOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
      
      {currentFunnel.length > 0 ? (
        <>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={currentFunnel}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="step" 
                tick={{ fontSize: 12 }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [value.toLocaleString(), 'Users']}
                labelFormatter={(label) => `Step: ${label}`}
              />
              <Bar dataKey="users" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          
          <div className="mt-4 grid gap-4" style={{ gridTemplateColumns: `repeat(${currentFunnel.length}, 1fr)` }}>
            {currentFunnel.map((step, i) => (
              <div key={i} className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">{step.step}</p>
                <p className="text-lg font-semibold text-gray-900">{step.users.toLocaleString()}</p>
                <p className="text-sm text-blue-600 font-medium">{step.rate.toFixed(1)}%</p>
                {i > 0 && (
                  <p className="text-xs text-red-600 mt-1">
                    Drop-off: {(currentFunnel[i-1].users - step.users).toLocaleString()}
                  </p>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-blue-800">Overall Conversion Rate:</span>
              <span className="text-sm font-semibold text-blue-900">
                {currentFunnel.length > 0 ? 
                  ((currentFunnel[currentFunnel.length - 1].users / (currentFunnel[0].users || 1)) * 100).toFixed(1) : 0}%
              </span>
            </div>
          </div>
          
          {/* Debug Info - Remove this once everything is working */}
          {debugInfo && (
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg text-xs">
              <p><strong>Debug Info:</strong></p>
              <p>Total Pages Found: {debugInfo.totalPagesFound}</p>
              <p>Total Conversions Found: {debugInfo.conversionsFound}</p>
              <p>Pricing Pages Found: {debugInfo.pricingPagesFound?.join(', ') || 'None'}</p>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No funnel data available for this selection.</p>
        </div>
      )}
    </div>
  );
}
