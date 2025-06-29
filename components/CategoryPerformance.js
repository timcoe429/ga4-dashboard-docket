'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export default function CategoryPerformance({ categoryPerformance, highTrafficLowConversion }) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!categoryPerformance || Object.keys(categoryPerformance).length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Category Performance Analysis</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">Loading category data...</p>
        </div>
      </div>
    );
  }

  const categoryData = Object.keys(categoryPerformance).map(category => ({
    category,
    ...categoryPerformance[category]
  })).sort((a, b) => b.conversionRate - a.conversionRate);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Content Performance Analysis</h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 px-2 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>
      
      {isExpanded && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Conversion Rates */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Conversion Rate by Content Type</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'conversionRate' ? `${value}%` : value,
                      name === 'conversionRate' ? 'Conversion Rate' : name
                    ]}
                  />
                  <Bar dataKey="conversionRate" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Traffic Distribution */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Traffic Distribution</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="sessions"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [value.toLocaleString(), 'Sessions']}
                    labelFormatter={(label) => `${label} Content`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Stats Table */}
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Detailed Performance</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b">
                    <th className="pb-3 font-medium">Content Type</th>
                    <th className="pb-3 font-medium text-right">Sessions</th>
                    <th className="pb-3 font-medium text-right">Conversions</th>
                    <th className="pb-3 font-medium text-right">Conv. Rate</th>
                    <th className="pb-3 font-medium text-right">Pages</th>
                    <th className="pb-3 font-medium text-right">Avg Conv/Page</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryData.map((category, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-3 text-sm font-medium text-gray-900">{category.category}</td>
                      <td className="py-3 text-sm text-gray-600 text-right">{category.sessions.toLocaleString()}</td>
                      <td className="py-3 text-sm text-gray-600 text-right">{category.conversions.toLocaleString()}</td>
                      <td className="py-3 text-sm font-medium text-right">
                        <span className={`${category.conversionRate > 2 ? 'text-green-600' : category.conversionRate > 1 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {category.conversionRate}%
                        </span>
                      </td>
                      <td className="py-3 text-sm text-gray-600 text-right">{category.pages}</td>
                      <td className="py-3 text-sm text-gray-600 text-right">
                        {(category.conversions / category.pages).toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* High Traffic, Low Conversion Opportunities */}
          {highTrafficLowConversion && highTrafficLowConversion.length > 0 && (
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <h3 className="text-lg font-medium text-yellow-800 mb-3">⚡ Optimization Opportunities</h3>
              <p className="text-sm text-yellow-700 mb-3">High traffic pages with low conversion rates - prime for optimization:</p>
              <div className="space-y-2">
                {highTrafficLowConversion.map((page, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span className="text-yellow-800 font-medium">{page.title}</span>
                    <div className="flex gap-4 text-yellow-700">
                      <span>{page.sessions.toLocaleString()} sessions</span>
                      <span className="font-medium">{page.conversionRate}% conv rate</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 