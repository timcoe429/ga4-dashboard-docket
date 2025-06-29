'use client';
import { useState } from 'react';
import { ChevronDown, ChevronUp, Users, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';

export default function ConversionFunnel({ funnelData, showComparison = false }) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!funnelData || funnelData.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">🔄 Conversion Funnel Analysis</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">Loading funnel data...</p>
        </div>
      </div>
    );
  }

  // Calculate drop-off rates
  const funnelSteps = funnelData.map((step, index) => {
    const dropOffRate = index > 0 ? 
      ((funnelData[index - 1].users - step.users) / funnelData[index - 1].users * 100) : 0;
    const conversionRate = (step.users / funnelData[0].users * 100);
    
    return {
      ...step,
      dropOffRate: parseFloat(dropOffRate.toFixed(1)),
      conversionRate: parseFloat(conversionRate.toFixed(1)),
      dropOffUsers: index > 0 ? funnelData[index - 1].users - step.users : 0
    };
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">🔄 Conversion Funnel Analysis</h2>
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
          {/* Funnel Visualization */}
          <div className="space-y-4">
            {funnelSteps.map((step, index) => (
              <div key={index} className="relative">
                {/* Funnel Step */}
                <div className="flex items-center">
                  {/* Step Visual */}
                  <div 
                    className="relative bg-blue-500 text-white rounded-lg p-4 shadow-md transition-all hover:shadow-lg"
                    style={{ 
                      width: `${Math.max(step.conversionRate, 15)}%`,
                      minWidth: '200px'
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-sm">{step.name}</h3>
                        <p className="text-xs opacity-90">{step.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span className="font-bold">{step.users.toLocaleString()}</span>
                        </div>
                        <div className="text-xs opacity-90">{step.conversionRate}%</div>
                      </div>
                    </div>
                  </div>

                  {/* Drop-off Info */}
                  {index > 0 && step.dropOffRate > 0 && (
                    <div className="ml-4 flex items-center gap-2">
                      <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                        step.dropOffRate > 50 ? 'bg-red-100 text-red-700' : 
                        step.dropOffRate > 25 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                      }`}>
                        <TrendingDown className="w-4 h-4" />
                        <span className="font-medium">{step.dropOffRate}% drop-off</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        (-{step.dropOffUsers.toLocaleString()} users)
                      </span>
                    </div>
                  )}

                  {/* Comparison Data */}
                  {showComparison && step.previousUsers && (
                    <div className="ml-4">
                      <div className={`text-xs px-2 py-1 rounded ${
                        step.users > step.previousUsers ? 'bg-green-50 text-green-700' : 
                        step.users < step.previousUsers ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-700'
                      }`}>
                        {step.users > step.previousUsers ? '+' : ''}
                        {((step.users - step.previousUsers) / step.previousUsers * 100).toFixed(1)}% vs previous
                      </div>
                    </div>
                  )}
                </div>

                {/* Connector Arrow */}
                {index < funnelSteps.length - 1 && (
                  <div className="flex justify-center my-2">
                    <div className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full">
                      <ChevronDown className="w-5 h-5 text-gray-600" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Funnel Insights */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Biggest Drop-off */}
            {(() => {
              const biggestDropOff = funnelSteps.slice(1).reduce((max, step) => 
                step.dropOffRate > max.dropOffRate ? step : max
              );
              return (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="font-medium text-red-800">Biggest Drop-off</span>
                  </div>
                  <p className="text-sm text-red-700">
                    <strong>{biggestDropOff.dropOffRate}%</strong> of users leave at {biggestDropOff.name}
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    Priority optimization target
                  </p>
                </div>
              );
            })()}

            {/* Overall Conversion */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-800">Overall Conversion</span>
              </div>
              <p className="text-sm text-blue-700">
                <strong>{funnelSteps[funnelSteps.length - 1]?.conversionRate}%</strong> complete the journey
              </p>
              <p className="text-xs text-blue-600 mt-1">
                {funnelSteps[funnelSteps.length - 1]?.users.toLocaleString()} conversions
              </p>
            </div>

            {/* Improvement Potential */}
            {(() => {
              const currentConversions = funnelSteps[funnelSteps.length - 1]?.users || 0;
              const potentialConversions = Math.round(funnelSteps[0]?.users * 0.05); // 5% benchmark
              const improvement = potentialConversions - currentConversions;
              
              return (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800">Improvement Potential</span>
                  </div>
                  <p className="text-sm text-green-700">
                    <strong>+{improvement > 0 ? improvement.toLocaleString() : 0}</strong> more conversions possible
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    At 5% conversion rate
                  </p>
                </div>
              );
            })()}
          </div>

          {/* Step-by-Step Recommendations */}
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">🎯 Optimization Recommendations</h3>
            <div className="space-y-3">
              {funnelSteps.slice(1).map((step, index) => {
                if (step.dropOffRate > 30) {
                  return (
                    <div key={index} className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-yellow-800">{step.name}</p>
                          <p className="text-sm text-yellow-700">
                            High drop-off rate ({step.dropOffRate}%). Consider:
                          </p>
                          <ul className="text-xs text-yellow-600 mt-1 ml-4 list-disc">
                            <li>Simplify the {step.name.toLowerCase()} process</li>
                            <li>Add trust signals and testimonials</li>
                            <li>Reduce form fields or steps required</li>
                            <li>A/B test different approaches</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }).filter(Boolean)}
            </div>
          </div>
        </>
      )}
    </div>
  );
} 