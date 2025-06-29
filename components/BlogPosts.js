import { ArrowUpRight, ArrowDownRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export default function BlogPosts({ data }) {
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
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b">
                  <th className="pb-3 font-medium">Blog Post</th>
                  <th className="pb-3 font-medium text-right">Views</th>
                  <th className="pb-3 font-medium text-right">Traffic Change</th>
                </tr>
              </thead>
              <tbody>
                {data.map((post, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3 pr-4">
                      <h3 className="text-sm font-medium text-gray-900">{post.title || 'Untitled'}</h3>
                    </td>
                    <td className="py-3 text-sm text-gray-600 text-right font-medium">
                      {(post.views || post.sessions || 0).toLocaleString()}
                    </td>
                    <td className="py-3 text-right">
                      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${
                        post.trend > 0 ? 'bg-green-100 text-green-700' : 
                        post.trend < 0 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {post.trend > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        {post.trend > 0 ? '+' : ''}{parseFloat(post.trend || 0).toFixed(1)}%
                      </div>
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
                <span className="font-bold">
                  {data.filter(post => post.trend > 0).length} posts trending up
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
