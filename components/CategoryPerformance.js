'use client';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export default function CategoryPerformance({ categoryPerformance, highTrafficLowConversion }) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!categoryPerformance || Object.keys(categoryPerformance).length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">⚡ Optimization Opportunities</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">Loading optimization data...</p>
        </div>
      </div>
    );
  }

  const categoryData = Object.keys(categoryPerformance)
    .filter(category => category !== 'Other') // Remove "Other" category
    .map(category => ({
      category,
      ...categoryPerformance[category]
    })).sort((a, b) => b.conversionRate - a.conversionRate);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">⚡ Optimization Opportunities</h2>
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
          {/* High Traffic, Low Conversion Opportunities - FEATURED */}
          {highTrafficLowConversion && highTrafficLowConversion.length > 0 && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="text-lg font-medium text-yellow-800 mb-3">🎯 Priority Optimization Targets</h3>
              <p className="text-sm text-yellow-700 mb-4">High traffic pages with low conversion rates - your biggest opportunities:</p>
              <div className="space-y-3">
                {highTrafficLowConversion.map((page, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-white rounded border">
                    <div>
                      <span className="text-yellow-900 font-medium">{page.title}</span>
                      <div className="text-xs text-yellow-700 mt-1">{page.page}</div>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <div className="text-right">
                        <div className="font-bold text-yellow-800">{page.sessions.toLocaleString()}</div>
                        <div className="text-xs text-yellow-600">sessions</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-red-600">{page.conversionRate}%</div>
                        <div className="text-xs text-red-500">conv rate</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">
                          {Math.round(page.sessions * 0.02 - page.conversions)}
                        </div>
                        <div className="text-xs text-green-500">potential conv.</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}



          {/* Quick Category Insights */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {categoryData.slice(0, 3).map((category, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-900 mb-1">{category.category}</div>
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500">{category.sessions.toLocaleString()} sessions</div>
                  <div className={`text-sm font-bold ${
                    category.conversionRate > 2 ? 'text-green-600' : 
                    category.conversionRate > 1 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {category.conversionRate}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
} 