export default function ConvertingPages({ data }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Converting Pages</h2>
      <div className="space-y-3">
        {data.map((page, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <h3 className="text-sm font-medium text-gray-900">{page.page}</h3>
              <p className="text-xs text-gray-500">{page.conversions.toLocaleString()} conversions</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">${page.revenue.toLocaleString()}</p>
              <p className="text-xs text-gray-500">${page.avgValue} avg</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
