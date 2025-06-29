import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';

export default function TopPages({ data, showComparison = false }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Landing Pages</h2>
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
        <div className="text-xs text-gray-500">
          Ranked by total sessions
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-500 border-b">
              <th className="pb-3 font-medium">Page</th>
              <th className="pb-3 font-medium text-right">Sessions</th>
              <th className="pb-3 font-medium text-right">Users</th>
              <th className="pb-3 font-medium text-right">Conversions</th>
              <th className="pb-3 font-medium text-right">Conv. Rate</th>
              <th className="pb-3 font-medium text-right">Engagement</th>
              {showComparison && <th className="pb-3 font-medium text-right">Trend</th>}
              <th className="pb-3 font-medium text-center">Status</th>
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
                <td className="py-3 text-sm text-gray-600 text-right font-medium">
                  {page.sessions.toLocaleString()}
                </td>
                <td className="py-3 text-sm text-gray-600 text-right">
                  {page.users?.toLocaleString() || 0}
                </td>
                <td className="py-3 text-sm text-right">
                  <span className={`font-medium ${page.conversions > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                    {page.conversions.toLocaleString()}
                  </span>
                </td>
                <td className="py-3 text-sm text-right">
                  <span className={`font-medium ${
                    page.conversionRate > 3 ? 'text-green-600' : 
                    page.conversionRate > 1 ? 'text-yellow-600' : 
                    page.conversionRate > 0 ? 'text-orange-600' : 'text-red-600'
                  }`}>
                    {page.conversionRate}%
                  </span>
                </td>
                <td className="py-3 text-sm text-gray-600 text-right">
                  {page.engagementScore ? (
                    <span className={`${
                      page.engagementScore > 50 ? 'text-green-600' : 
                      page.engagementScore > 20 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {page.engagementScore}
                    </span>
                  ) : '-'}
                </td>
                {showComparison && (
                  <td className="py-3 text-right">
                    {page.trend !== undefined && (
                      <span className={`flex items-center justify-end gap-1 text-sm font-medium ${
                        page.trend > 0 ? 'text-green-600' : page.trend < 0 ? 'text-red-600' : 'text-gray-500'
                      }`}>
                        {page.trend > 0 ? <TrendingUp className="w-4 h-4" /> : 
                         page.trend < 0 ? <TrendingDown className="w-4 h-4" /> : null}
                        {Math.abs(page.trend).toFixed(1)}%
                      </span>
                    )}
                  </td>
                )}
                <td className="py-3 text-center">
                  {page.sessions > 100 && page.conversionRate < 1 ? (
                    <AlertTriangle className="w-4 h-4 text-yellow-500 mx-auto" title="High traffic, low conversion - optimization opportunity" />
                  ) : page.conversionRate > 2 ? (
                    <CheckCircle className="w-4 h-4 text-green-500 mx-auto" title="High performing page" />
                  ) : (
                    <div className="w-4 h-4 mx-auto"></div>
                  )}
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
    </div>
  );
}
