import { TrendingUp, TrendingDown, Target, Users, Eye } from 'lucide-react';

export default function ConvertingPages({ data, showComparison = false }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Converting Pages</h2>
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
        <div className="text-xs text-gray-500">
          Ranked by conversion rate
        </div>
      </div>
      
      <div className="space-y-4">
        {data.map((page, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900 mb-1">
                  {page.title || page.page}
                </h3>
                <p className="text-xs text-gray-500">{page.page}</p>
                {page.category && (
                  <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mt-1">
                    {page.category}
                  </span>
                )}
              </div>
              
              {/* Conversion Rate Badge */}
              <div className="text-right">
                <div className={`text-lg font-bold ${
                  page.conversionRate > 5 ? 'text-green-600' : 
                  page.conversionRate > 2 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {page.conversionRate}%
                </div>
                {showComparison && page.trend !== undefined && (
                  <div className={`flex items-center gap-1 text-xs font-medium ${
                    page.trend > 0 ? 'text-green-600' : page.trend < 0 ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    {page.trend > 0 ? <TrendingUp className="w-3 h-3" /> : 
                     page.trend < 0 ? <TrendingDown className="w-3 h-3" /> : null}
                    {page.trend > 0 ? '+' : ''}{page.trend}%
                  </div>
                )}
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{page.sessions.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Sessions</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{page.conversions.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Conversions</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{page.users?.toLocaleString() || 0}</p>
                  <p className="text-xs text-gray-500">Users</p>
                </div>
              </div>
            </div>

            {/* Performance Indicators */}
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {page.conversionValue && (
                  <span className="text-xs text-green-600 font-medium">
                    ${page.conversionValue.toLocaleString()} value
                  </span>
                )}
                {page.engagementScore && (
                  <span className="text-xs text-blue-600">
                    {page.engagementScore} engagement
                  </span>
                )}
              </div>
              
              <div className="text-xs text-gray-500">
                {page.bounceRate ? `${page.bounceRate.toFixed(1)}% bounce` : ''}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Summary Stats */}
      <div className="mt-4 p-3 bg-green-50 rounded-lg">
        <div className="flex justify-between items-center text-sm">
          <span className="text-green-800 font-medium">Total from top converters:</span>
          <div className="flex gap-4 text-green-700">
            <span>{data.reduce((sum, page) => sum + page.sessions, 0).toLocaleString()} sessions</span>
            <span>{data.reduce((sum, page) => sum + page.conversions, 0).toLocaleString()} conversions</span>
            <span className="font-semibold">
              {data.length > 0 ? 
                (data.reduce((sum, page) => sum + page.conversions, 0) / 
                 data.reduce((sum, page) => sum + page.sessions, 0) * 100).toFixed(1) : 0}% avg rate
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
