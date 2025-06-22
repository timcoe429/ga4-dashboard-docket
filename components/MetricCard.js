export default function MetricCard({ title, value, trend, subtitle }) {
  const isPositive = trend > 0;
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
      <div className="flex items-baseline justify-between">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        {trend && (
          <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}
