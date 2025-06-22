import { TrendingUp, TrendingDown } from 'lucide-react';

export default function TopPages({ data }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Landing Pages</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-500 border-b">
              <th className="pb-3 font-medium">Page</th>
              <th className="pb-3 font-medium">Sessions</th>
              <th className="pb-3 font-medium">Conversions</th>
              <th className="pb-3 font-medium">Conv. Rate</th>
              <th className="pb-3 font-medium">Trend</th>
            </tr>
          </thead>
          <tbody>
            {data.map((page, i) => (
              <tr key={i} className="border-b last:border-0">
                <td className="py-3 text-sm font-medium text-gray-900">{page.page}</td>
                <td className="py-3 text-sm text-gray-600">{page.sessions.toLocaleString()}</td>
                <td className="py-3 text-sm text-gray-600">{page.conversions.toLocaleString()}</td>
                <td className="py-3 text-sm text-gray-900 font-medium">{page.rate}%</td>
                <td className="py-3">
                  <span className={`flex items-center gap-1 text-sm font-medium ${page.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {page.trend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {Math.abs(page.trend)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
