export default function ConvertingPages({ data }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Converting Pages</h2>
      <div className="space-y-3">
        {data.map((page, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900">{page.page}</h3>
              <p className="text-xs text-gray-500">{page.conversions.toLocaleString()} conversions from {page.sessions?.toLocaleString() || 0} sessions</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-green-600">{page.rate || 0}%</p>
              <p className="text-xs text-gray-500">conversion rate</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
