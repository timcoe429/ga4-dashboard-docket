import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function BlogPosts({ data }) {
  // Handle empty or invalid data
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Blog Posts on the Move 🔥</h2>
        <div className="text-sm text-gray-500">No blog posts found</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Blog Posts on the Move 🔥</h2>
      <div className="space-y-3">
        {data.map((post, i) => (
          <div key={i} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900 mb-1">{post.title || 'Untitled'}</h3>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>{(post.views || post.sessions || 0).toLocaleString()} views</span>
                <span>{post.conversions || 0} conversions</span>
              </div>
            </div>
            <div className={`flex items-center gap-1 text-sm font-medium ${post.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {post.trend > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              {post.trend > 0 ? '+' : ''}{parseFloat(post.trend || 0).toFixed(1)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
