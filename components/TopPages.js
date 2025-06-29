import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, ChevronDown, ChevronUp, Zap } from 'lucide-react';
import { useState } from 'react';

export default function TopPages({ data, showComparison = false }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedPage, setSelectedPage] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">📊 Top Landing Pages</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">No page data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">📊 Top Landing Pages</h2>
        <div className="flex items-center gap-3">
          <div className="text-xs text-gray-500">
            Ranked by total sessions
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
                  <th className="pb-3 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((page, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3 pr-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{page.title || page.page}</p>
                        <p className="text-xs text-gray-500">{page.page}</p>
                        {page.category && (
                          <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded mt-1">
                            {page.category}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 text-sm text-gray-600 text-center font-medium">
                      {page.sessions.toLocaleString()}
                      {showComparison && page.sessionsTrend !== undefined && (
                        <div className={`text-xs font-medium ${page.sessionsTrend > 0 ? 'text-green-600' : page.sessionsTrend < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                          {page.sessionsTrend > 0 ? '+' : ''}{page.sessionsTrend}%
                        </div>
                      )}
                    </td>
                    <td className="py-3 text-sm text-center">
                      <span className={`font-medium ${page.conversions > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                        {page.conversions.toLocaleString()}
                      </span>
                      {showComparison && page.conversionsTrend !== undefined && (
                        <div className={`text-xs font-medium ${page.conversionsTrend > 0 ? 'text-green-600' : page.conversionsTrend < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                          {page.conversionsTrend > 0 ? '+' : ''}{page.conversionsTrend}%
                        </div>
                      )}
                    </td>
                    <td className="py-3 text-sm text-center">
                      <span className={`font-medium ${
                        page.conversionRate > 3 ? 'text-green-600' : 
                        page.conversionRate > 1 ? 'text-yellow-600' : 
                        page.conversionRate > 0 ? 'text-orange-600' : 'text-red-600'
                      }`}>
                        {page.conversionRate}%
                      </span>
                    </td>
                    {showComparison && (
                      <td className="py-3 text-center">
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
                    <td className="py-3 text-center">
                      <button
                        onClick={() => setSelectedPage(page)}
                        className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                      >
                        <Zap className="w-3 h-3" />
                        Analyze
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Insights */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-800">High Performers</p>
              <p className="text-xs text-blue-600">
                {data.filter(p => p.conversionRate > 2).length} pages with 2%+ conversion rate
              </p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <p className="text-sm font-medium text-yellow-800">Opportunities</p>
              <p className="text-xs text-yellow-600">
                {data.filter(p => p.sessions > 100 && p.conversionRate < 1).length} high-traffic pages to optimize
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm font-medium text-green-800">Total Impact</p>
              <p className="text-xs text-green-600">
                {data.reduce((sum, p) => sum + p.conversions, 0).toLocaleString()} conversions from top pages
              </p>
            </div>
          </div>
        </>
      )}

      {/* Page Analysis Modal */}
      {selectedPage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedPage.title || selectedPage.page}</h3>
                  <p className="text-sm text-gray-500">{selectedPage.page}</p>
                </div>
                <button
                  onClick={() => setSelectedPage(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Performance Overview */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{selectedPage.sessions.toLocaleString()}</div>
                  <div className="text-sm text-blue-800">Sessions</div>
                  {showComparison && selectedPage.sessionsTrend !== undefined && (
                    <div className={`text-xs font-medium ${selectedPage.sessionsTrend > 0 ? 'text-green-600' : selectedPage.sessionsTrend < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                      {selectedPage.sessionsTrend > 0 ? '+' : ''}{selectedPage.sessionsTrend}% vs previous
                    </div>
                  )}
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{selectedPage.conversions.toLocaleString()}</div>
                  <div className="text-sm text-green-800">Conversions</div>
                  {showComparison && selectedPage.conversionsTrend !== undefined && (
                    <div className={`text-xs font-medium ${selectedPage.conversionsTrend > 0 ? 'text-green-600' : selectedPage.conversionsTrend < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                      {selectedPage.conversionsTrend > 0 ? '+' : ''}{selectedPage.conversionsTrend}% vs previous
                    </div>
                  )}
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{selectedPage.conversionRate}%</div>
                  <div className="text-sm text-purple-800">Conv. Rate</div>
                  {showComparison && selectedPage.trend !== undefined && (
                    <div className={`text-xs font-medium ${selectedPage.trend > 0 ? 'text-green-600' : selectedPage.trend < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                      {selectedPage.trend > 0 ? '+' : ''}{selectedPage.trend}% vs previous
                    </div>
                  )}
                </div>
              </div>

              {/* Analysis & Recommendations */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Analysis & Recommendations</h4>
                
                {selectedPage.sessions > 100 && selectedPage.conversionRate < 1 && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      <span className="font-medium text-yellow-800">High Traffic, Low Conversion</span>
                    </div>
                    <p className="text-sm text-yellow-700">
                      This page gets significant traffic ({selectedPage.sessions.toLocaleString()} sessions) but has a low conversion rate ({selectedPage.conversionRate}%). 
                      Focus on optimizing this page for better results.
                    </p>
                  </div>
                )}

                {selectedPage.conversionRate > 2 && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-800">High Performing Page</span>
                    </div>
                    <p className="text-sm text-green-700">
                      This page has an excellent conversion rate ({selectedPage.conversionRate}%). 
                      Use this as a template for optimizing other pages.
                    </p>
                  </div>
                )}

                {showComparison && selectedPage.trend > 0 && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-blue-800">Improving Performance</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      Conversion rate improved by {selectedPage.trend}% compared to the previous period. 
                      Whatever changes were made are working!
                    </p>
                  </div>
                )}

                {showComparison && selectedPage.trend < -5 && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingDown className="w-5 h-5 text-red-600" />
                      <span className="font-medium text-red-800">Declining Performance</span>
                    </div>
                    <p className="text-sm text-red-700">
                      Conversion rate dropped by {Math.abs(selectedPage.trend)}% compared to the previous period. 
                      This page needs immediate attention.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
