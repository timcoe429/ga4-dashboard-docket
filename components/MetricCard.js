export default function MetricCard({ title, value, trend, subtitle }) {
  const isPositive = trend > 0;
  
  return (
    <div className={`bg-white rounded-xl shadow-sm border-2 p-6 transition-all ${
      trend === 0 ? 'border-gray-200' : 
      isPositive ? 'border-green-300 shadow-green-100' : 'border-red-300 shadow-red-100'
    }`}>
      <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
      <div className="flex items-baseline justify-between">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        {trend !== 0 && (
          <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{parseFloat(trend).toFixed(1)}%
          </span>
        )}
      </div>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}
