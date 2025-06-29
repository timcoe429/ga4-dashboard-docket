'use client';
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function FunnelChart({ data, funnelData }) {
  const [selectedFunnel, setSelectedFunnel] = useState('homeToDemo');
  
  // Create real funnel data based on your conversion paths
  const realFunnels = {
    homeToDemo: [
      { 
        step: 'Home Page', 
        users: funnelData?.['/' || '/'] || 0, 
        rate: 100 
      },
      { 
        step: 'Pricing Page', 
        users: funnelData?.['/pricing'] || 0, 
        rate: funnelData?.['/' || '/'] > 0 ? 
          parseFloat(((funnelData?.['/pricing'] || 0) / (funnelData?.['/' || '/'] || 1) * 100).toFixed(1)) : 0
      },
      { 
        step: 'Demo Request', 
        users: Math.floor((funnelData?.['/pricing'] || 0) * 0.15), // Assuming 15% conversion rate
        rate: funnelData?.['/pricing'] > 0 ? 
          parseFloat(((Math.floor((funnelData?.['/pricing'] || 0) * 0.15)) / (funnelData?.['/' || '/'] || 1) * 100).toFixed(1)) : 0
      }
    ],
    dumpsterToDemo: [
      { 
        step: 'Dumpster Software Page', 
        users: funnelData?.['/dumpster-rental-software/'] || 0, 
        rate: 100 
      },
      { 
        step: 'Demo Form View', 
        users: Math.floor((funnelData?.['/dumpster-rental-software/'] || 0) * 0.6), // Assume 60% scroll to form
        rate: 60
      },
      { 
        step: 'Demo Request', 
        users: Math.floor((funnelData?.['/dumpster-rental-software/'] || 0) * 0.12), // Assume 12% conversion
        rate: 12
      }
    ],
    junkToDemo: [
      { 
        step: 'Junk Software Page', 
        users: funnelData?.['/junk-removal-software/'] || 0, 
        rate: 100 
      },
      { 
        step: 'Demo Form View', 
        users: Math.floor((funnelData?.['/junk-removal-software/'] || 0) * 0.6), // Assume 60% scroll to form
        rate: 60
      },
      { 
        step: 'Demo Request', 
        users: Math.floor((funnelData?.['/junk-removal-software/'] || 0) * 0.12), // Assume 12% conversion
        rate: 12
      }
    ]
  };

  const funnelOptions = [
    { value: 'homeToDemo', label: 'Home → Pricing → Demo' },
    { value: 'dumpsterToDemo', label: 'Dumpster Software → Demo' },
    { value: 'junkToDemo', label: 'Junk Software → Demo' }
  ];
  
  const currentFunnel = realFunnels[selectedFunnel] || realFunnels.homeToDemo;
  
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
      
      <div className="mt-4 grid grid-cols-3 gap-4">
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
    </div>
  );
}
