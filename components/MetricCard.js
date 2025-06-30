export default function MetricCard({ title, value, trend, subtitle }) {
  const isPositive = trend > 0;
  
  const getTooltipText = (title) => {
    switch (title) {
      case 'Total Sessions':
        return 'The total number of user sessions on your website during the selected time period';
      case 'Conversions':
        return 'Number of completed conversion goals (form submissions, demo requests, etc.)';
      case 'Conversion Rate':
        return 'Percentage of sessions that resulted in a conversion goal completion';
      case 'Total Users':
      case 'Users':
        return 'Number of unique visitors to your website during the selected time period';
      default:
        return 'Analytics metric for the selected time period';
    }
  };
  
  return (
    <div className={`bg-white rounded-xl shadow-sm border-2 p-6 transition-all ${
      trend === 0 ? 'border-gray-200' : 
      isPositive ? 'border-green-300 shadow-green-100' : 'border-red-300 shadow-red-100'
    }`}>
      <div className="flex items-center gap-1 mb-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className="relative group">
          <svg className="w-3 h-3 text-gray-400 cursor-help" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
                     <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 w-48 text-center">
             {getTooltipText(title)}
           </div>
        </div>
      </div>
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
