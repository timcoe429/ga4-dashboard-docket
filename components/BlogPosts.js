import { ArrowUpRight, ArrowDownRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export default function BlogPosts({ data, showComparison = false }) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Handle empty or invalid data
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">📈 Blog Traffic Trends</h2>
        <div className="text-sm text-gray-500">No blog posts found</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">📈 Blog Traffic Trends</h2>
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
          <div className="overflow-x-auto">
            <table className="w-full table-fixed">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b">
                  <th className="pb-3 font-medium w-3/5">Blog Post</th>
                  <th className="pb-3 font-medium text-center w-24">Views</th>
                  <th className="pb-3 font-medium text-center w-32">
                    {showComparison ? 'Traffic Change' : 'Views Trend'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((post, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3 pr-4">
                      <div className="text-left">
                        <h3 className="text-sm font-medium text-gray-900 truncate">{post.title || 'Untitled'}</h3>
                      </div>
                    </td>
                    <td className="py-3 text-center">
                      <div className="text-sm text-gray-600 font-medium">
                        {(post.views || post.sessions || 0).toLocaleString()}
                      </div>
                    </td>
                    <td className="py-3 text-center">
                      {showComparison ? (
                        // Show comparison trend when in comparison mode
                        (post.sessionsTrend !== undefined && post.sessionsTrend !== 0) ? (
                          <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${
                            post.sessionsTrend > 0 ? 'bg-green-100 text-green-700' : 
                            post.sessionsTrend < 0 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {post.sessionsTrend > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                            {post.sessionsTrend > 0 ? '+' : ''}{parseFloat(post.sessionsTrend).toFixed(1)}%
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold bg-gray-100 text-gray-500">
                            No change
                          </div>
                        )
                      ) : (
                        // Show static message when not in comparison mode
                        <div className="text-xs text-gray-500 italic">
                          Enable comparison to see trends
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Summary */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center text-sm">
              <span className="text-blue-800 font-medium">Blog Performance Summary:</span>
              <div className="flex gap-6 text-blue-700">
                <span className="font-bold">
                  {data.reduce((sum, post) => sum + (post.views || post.sessions || 0), 0).toLocaleString()} total views
                </span>
                {showComparison && (
                  <span className="font-bold">
                    {data.filter(post => post.sessionsTrend && post.sessionsTrend > 0).length} posts trending up
                  </span>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
