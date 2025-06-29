'use client';
import { useState } from 'react';
import { ChevronDown, ChevronUp, Trophy, AlertTriangle, Play, Pause, CheckCircle, XCircle, TrendingUp, Users } from 'lucide-react';

export default function ABTestingDashboard({ abTestData, showComparison = false }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedTest, setSelectedTest] = useState(null);

  if (!abTestData || !abTestData.activeTests) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">🧪 A/B Testing Dashboard</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">Loading A/B test data...</p>
        </div>
      </div>
    );
  }

  const { activeTests, completedTests, testingSummary } = abTestData;

  // Helper function to calculate statistical significance
  const calculateSignificance = (variantA, variantB) => {
    const conversionsA = variantA.conversions;
    const conversionsB = variantB.conversions;
    const visitorsA = variantA.visitors;
    const visitorsB = variantB.visitors;
    
    const rateA = conversionsA / visitorsA;
    const rateB = conversionsB / visitorsB;
    
    // Simplified z-test calculation
    const pooledRate = (conversionsA + conversionsB) / (visitorsA + visitorsB);
    const standardError = Math.sqrt(pooledRate * (1 - pooledRate) * (1/visitorsA + 1/visitorsB));
    const zScore = Math.abs(rateA - rateB) / standardError;
    
    // Convert z-score to confidence level (simplified)
    let confidence = 0;
    if (zScore > 2.58) confidence = 99;
    else if (zScore > 2.33) confidence = 98;
    else if (zScore > 1.96) confidence = 95;
    else if (zScore > 1.64) confidence = 90;
    else confidence = Math.round(((zScore / 1.96) * 95));
    
    return Math.min(confidence, 99);
  };

  const getTestStatus = (test) => {
    if (test.status === 'completed') return test.status;
    
    const significance = calculateSignificance(test.variants[0], test.variants[1]);
    if (significance >= 95) return 'significant';
    if (test.duration >= 14) return 'ready-to-call';
    return 'running';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'significant': return 'text-green-600 bg-green-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      case 'ready-to-call': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">🧪 A/B Testing Dashboard</h2>
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
          {/* Testing Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Play className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-800">Active Tests</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">{testingSummary.activeTests}</div>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">Significant Results</span>
              </div>
              <div className="text-2xl font-bold text-green-600">{testingSummary.significantTests}</div>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-purple-800">Avg Uplift</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">{testingSummary.avgUplift}%</div>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-orange-600" />
                <span className="font-medium text-orange-800">Total Visitors</span>
              </div>
              <div className="text-2xl font-bold text-orange-600">{testingSummary.totalVisitors.toLocaleString()}</div>
            </div>
          </div>

          {/* Active Tests */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">🚀 Active A/B Tests</h3>
            <div className="space-y-4">
              {activeTests.map((test, index) => {
                const status = getTestStatus(test);
                const significance = calculateSignificance(test.variants[0], test.variants[1]);
                const winner = test.variants[0].conversionRate > test.variants[1].conversionRate ? 0 : 1;
                const uplift = ((test.variants[winner].conversionRate - test.variants[1-winner].conversionRate) / test.variants[1-winner].conversionRate * 100);

                return (
                  <div 
                    key={index} 
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => setSelectedTest(selectedTest === index ? null : index)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900">{test.testName}</h4>
                        <p className="text-sm text-gray-600">{test.pageUrl}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
                          {status === 'significant' ? `${significance}% Confident` : 
                           status === 'ready-to-call' ? 'Ready to Call' : 
                           status === 'completed' ? 'Completed' : 'Running'}
                        </span>
                        {status === 'significant' && (
                          <Trophy className="w-5 h-5 text-yellow-500" />
                        )}
                      </div>
                    </div>

                    {/* Variants Comparison */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {test.variants.map((variant, variantIndex) => (
                        <div 
                          key={variantIndex} 
                          className={`p-4 rounded-lg border-2 ${
                            status === 'significant' && variantIndex === winner ? 
                              'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-gray-900">
                              {variant.name}
                              {variantIndex === 0 && ' (Control)'}
                            </h5>
                            {status === 'significant' && variantIndex === winner && (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Visitors:</span>
                              <span className="font-medium">{variant.visitors.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Conversions:</span>
                              <span className="font-medium">{variant.conversions.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Conversion Rate:</span>
                              <span className="font-bold text-lg">{variant.conversionRate}%</span>
                            </div>
                            {variantIndex > 0 && (
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600">vs Control:</span>
                                <span className={`font-medium ${
                                  variant.conversionRate > test.variants[0].conversionRate ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {variant.conversionRate > test.variants[0].conversionRate ? '+' : ''}
                                  {((variant.conversionRate - test.variants[0].conversionRate) / test.variants[0].conversionRate * 100).toFixed(1)}%
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Test Details */}
                    <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                      <span>Running for {test.duration} days</span>
                      <span>Traffic Split: {test.trafficSplit}</span>
                      {status === 'significant' && (
                        <span className="font-medium text-green-600">
                          {uplift > 0 ? '+' : ''}{uplift.toFixed(1)}% uplift
                        </span>
                      )}
                    </div>

                    {/* Expanded Details */}
                    {selectedTest === index && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <div className="text-sm font-medium text-blue-800">Statistical Significance</div>
                            <div className="text-lg font-bold text-blue-600">{significance}%</div>
                          </div>
                          <div className="p-3 bg-green-50 rounded-lg">
                            <div className="text-sm font-medium text-green-800">Sample Size</div>
                            <div className="text-lg font-bold text-green-600">
                              {test.variants.reduce((sum, v) => sum + v.visitors, 0).toLocaleString()}
                            </div>
                          </div>
                          <div className="p-3 bg-purple-50 rounded-lg">
                            <div className="text-sm font-medium text-purple-800">Expected Completion</div>
                            <div className="text-lg font-bold text-purple-600">{test.expectedCompletion}</div>
                          </div>
                        </div>

                        {/* Recommendations */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-2">📊 Recommendations:</h4>
                          {status === 'significant' ? (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-green-700">
                                <CheckCircle className="w-4 h-4" />
                                <span>Test has reached statistical significance!</span>
                              </div>
                              <p className="text-sm text-gray-700">
                                Winner: <strong>{test.variants[winner].name}</strong> with {uplift.toFixed(1)}% uplift. 
                                Recommend implementing the winning variant.
                              </p>
                            </div>
                          ) : status === 'ready-to-call' ? (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-yellow-700">
                                <AlertTriangle className="w-4 h-4" />
                                <span>Test has been running for {test.duration} days but lacks significance.</span>
                              </div>
                              <p className="text-sm text-gray-700">
                                Consider calling the test or extending duration for more data.
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-blue-700">
                                <Play className="w-4 h-4" />
                                <span>Test is running normally. Continue monitoring.</span>
                              </div>
                              <p className="text-sm text-gray-700">
                                Need {Math.max(0, Math.round((1000 - test.variants.reduce((sum, v) => sum + v.visitors, 0)) / 2))} more visitors per variant.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Completed Tests Summary */}
          {completedTests && completedTests.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">📈 Recent Completed Tests</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {completedTests.slice(0, 6).map((test, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 truncate">{test.testName}</h4>
                      {test.hasWinner ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span>{test.duration} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Visitors:</span>
                        <span>{test.totalVisitors.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Result:</span>
                        <span className={test.hasWinner ? 'text-green-600 font-medium' : 'text-gray-500'}>
                          {test.hasWinner ? `${test.uplift}% uplift` : 'Inconclusive'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* A/B Testing Best Practices */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-blue-800 mb-3">🎯 A/B Testing Best Practices</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Test Requirements:</h4>
                <ul className="space-y-1 text-blue-700">
                  <li>• Minimum 1,000 visitors per variant</li>
                  <li>• Run for at least 2 weeks</li>
                  <li>• Test one variable at a time</li>
                  <li>• Wait for 95% statistical significance</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Optimization Tips:</h4>
                <ul className="space-y-1 text-blue-700">
                  <li>• Test high-impact pages first</li>
                  <li>• Focus on conversion elements</li>
                  <li>• Document all test learnings</li>
                  <li>• Plan follow-up tests based on results</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 