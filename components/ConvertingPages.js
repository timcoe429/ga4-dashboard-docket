import { TrendingUp, TrendingDown, ChevronDown, ChevronUp, Zap } from 'lucide-react';
import { useState } from 'react';

export default function ConvertingPages({ data, showComparison = false }) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">🎯 Top Converting Pages</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">No converting pages found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">🎯 Top Converting Pages</h2>
        <div className="flex items-center gap-3">
          <div className="text-xs text-gray-500">
            Ranked by conversion rate
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 px-2 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b">
                  <th className="pb-3 font-medium">Page</th>
                  <th className="pb-3 font-medium text-center">Sessions</th>
                  <th className="pb-3 font-medium text-center">Conversions</th>
                  <th className="pb-3 font-medium text-center">Conv. Rate</th>
                  {showComparison && <th className="pb-3 font-medium text-center">📈 Trend vs Previous</th>}
                </tr>
              </thead>
              <tbody>
                {data.map((page, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-4 pr-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{page.title || page.page}</p>
                        <p className="text-xs text-gray-500">{page.page}</p>
                        {page.category && (
                          <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full mt-1">
                            {page.category}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 text-sm text-gray-600 text-center font-medium">
                      {page.sessions.toLocaleString()}
                      {showComparison && page.sessionsTrend !== undefined && (
                        <div className={`text-xs font-medium ${page.sessionsTrend > 0 ? 'text-green-600' : page.sessionsTrend < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                          {page.sessionsTrend > 0 ? '+' : ''}{page.sessionsTrend}%
                        </div>
                      )}
                    </td>
                    <td className="py-4 text-sm text-center">
                      <span className="font-bold text-green-600">
                        {page.conversions.toLocaleString()}
                      </span>
                      {showComparison && page.conversionsTrend !== undefined && (
                        <div className={`text-xs font-medium ${page.conversionsTrend > 0 ? 'text-green-600' : page.conversionsTrend < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                          {page.conversionsTrend > 0 ? '+' : ''}{page.conversionsTrend}%
                        </div>
                      )}
                    </td>
                    <td className="py-4 text-center">
                      <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                        page.conversionRate > 5 ? 'bg-green-100 text-green-800' : 
                        page.conversionRate > 2 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {page.conversionRate}%
                      </div>
                    </td>
                    {showComparison && (
                      <td className="py-4 text-center">
                        {page.trend !== undefined && (
                          <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${
                            page.trend > 0 ? 'bg-green-100 text-green-700' : 
                            page.trend < 0 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {page.trend > 0 ? <TrendingUp className="w-4 h-4" /> : 
                             page.trend < 0 ? <TrendingDown className="w-4 h-4" /> : null}
                            {page.trend > 0 ? '+' : ''}{page.trend}%
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Clean Summary */}
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <div className="flex justify-between items-center text-sm">
              <span className="text-green-800 font-medium">Your top converters generated:</span>
              <div className="flex gap-6 text-green-700">
                <span className="font-bold">
                  {data.reduce((sum, page) => sum + page.conversions, 0).toLocaleString()} conversions
                </span>
                <span className="font-bold">
                  {data.length > 0 ? 
                    (data.reduce((sum, page) => sum + page.conversions, 0) / 
                     data.reduce((sum, page) => sum + page.sessions, 0) * 100).toFixed(1) : 0}% avg rate
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
