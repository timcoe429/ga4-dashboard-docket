import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function BlogPosts({ data }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Blog Posts on the Move 🔥</h2>
      <div className="space-y-3">
        {data.map((post, i) => (
          <div key={i} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900 mb-1">{post.title}</h3>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>{post.views.toLocaleString()} views</span>
                <span>{post.conversions} conversions</span>
              </div>
            </div>
            <div className={`flex items-center gap-1 text-sm font-medium ${post.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {post.trend > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              {post.trend > 0 ? '+' : ''}{post.trend}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
