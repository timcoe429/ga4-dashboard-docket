'use client';
import { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowRight, Target, Users, Eye, Star } from 'lucide-react';

export default function UserJourneyMap({ journeyData, showComparison = false }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedJourney, setSelectedJourney] = useState(null);

  if (!journeyData || !journeyData.topPaths) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">🗺️ User Journey Mapping</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">Loading journey data...</p>
        </div>
      </div>
    );
  }

  const { topPaths, assistingPages, completingPages, journeyInsights } = journeyData;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">🗺️ User Journey Mapping</h2>
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
          {/* Top Conversion Paths */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">🚀 Most Common Conversion Paths</h3>
            <div className="space-y-4">
              {topPaths.map((path, index) => (
                <div 
                  key={index} 
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => setSelectedJourney(selectedJourney === index ? null : index)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                        #{index + 1}
                      </span>
                      <span className="font-medium text-gray-900">
                        {path.conversions} conversions
                      </span>
                      <span className="text-sm text-gray-500">
                        ({path.percentage}% of all conversions)
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{path.users.toLocaleString()} users</span>
                    </div>
                  </div>

                  {/* Path Visualization */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {path.steps.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex items-center gap-2">
                        <div className={`px-3 py-2 rounded-lg text-sm font-medium ${
                          stepIndex === path.steps.length - 1 ? 
                            'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
                        }`}>
                          <div>{step.page}</div>
                          {step.url && (
                            <div className="text-xs opacity-75 mt-1">{step.url}</div>
                          )}
                        </div>
                        {stepIndex < path.steps.length - 1 && (
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Expanded Details */}
                  {selectedJourney === index && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <div className="text-sm font-medium text-blue-800">Average Time</div>
                          <div className="text-lg font-bold text-blue-600">{path.avgTimeToConvert}</div>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                          <div className="text-sm font-medium text-green-800">Conversion Rate</div>
                          <div className="text-lg font-bold text-green-600">{path.conversionRate}%</div>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <div className="text-sm font-medium text-purple-800">Avg. Touchpoints</div>
                          <div className="text-lg font-bold text-purple-600">{path.avgTouchpoints}</div>
                        </div>
                      </div>
                      
                      {/* Step Analysis with URLs */}
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-900 mb-3">🔍 Detailed Step Analysis:</h4>
                        <div className="space-y-3">
                          {path.steps.map((step, stepIndex) => (
                            <div key={stepIndex} className="p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <span className="font-medium text-gray-900">{step.page}</span>
                                  {step.url && (
                                    <div className="text-sm text-blue-600 font-mono">{step.url}</div>
                                  )}
                                </div>
                                <div className="text-right">
                                  <div className="text-xs text-gray-500">Step {stepIndex + 1}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-6 text-sm text-gray-600">
                                <span>⏱️ {step.avgTimeOnPage} avg time</span>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  parseFloat(step.dropOffRate) > 40 ? 'bg-red-100 text-red-700' :
                                  parseFloat(step.dropOffRate) > 20 ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-green-100 text-green-700'
                                }`}>
                                  📉 {step.dropOffRate} drop-off
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Journey Insights */}
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-800 mb-2">💡 Journey Insights:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-700">
                          <div>
                            <strong>Best Performing Step:</strong> {
                              path.steps.reduce((best, step) => 
                                parseFloat(step.dropOffRate) < parseFloat(best.dropOffRate) ? step : best
                              ).page
                            }
                          </div>
                          <div>
                            <strong>Optimization Target:</strong> {
                              path.steps.reduce((worst, step) => 
                                parseFloat(step.dropOffRate) > parseFloat(worst.dropOffRate) ? step : worst
                              ).page
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Attribution Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Assisting Pages */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">🤝 Top Assisting Pages</h3>
              <div className="space-y-3">
                {assistingPages.map((page, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <div className="font-medium text-blue-900">{page.title}</div>
                      <div className="text-xs text-blue-700">{page.page}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-blue-600">{page.assists}</div>
                      <div className="text-xs text-blue-500">assists</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Completing Pages */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">🎯 Top Converting Pages</h3>
              <div className="space-y-3">
                {completingPages.map((page, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <div className="font-medium text-green-900">{page.title}</div>
                      <div className="text-xs text-green-700">{page.page}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">{page.conversions}</div>
                      <div className="text-xs text-green-500">conversions</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Journey Insights - ENHANCED with more data */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-800">Avg Journey Length</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">{journeyInsights.avgJourneyLength}</div>
              <div className="text-xs text-blue-700">pages per conversion</div>
            </div>

            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">Direct Conversions</span>
              </div>
              <div className="text-2xl font-bold text-green-600">{journeyInsights.directConversions}%</div>
              <div className="text-xs text-green-700">single-page conversions</div>
            </div>

            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-purple-800">Multi-touch Rate</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">{journeyInsights.multiTouchRate}%</div>
              <div className="text-xs text-purple-700">multi-page journeys</div>
            </div>

            <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-orange-600" />
                <span className="font-medium text-orange-800">Total Traffic</span>
              </div>
              <div className="text-2xl font-bold text-orange-600">{journeyInsights.totalTraffic?.toLocaleString() || 'N/A'}</div>
              <div className="text-xs text-orange-700">sessions analyzed</div>
            </div>
          </div>

          {/* Additional Journey Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <div className="text-lg font-bold text-gray-900">{journeyInsights.totalConversions?.toLocaleString() || 'N/A'}</div>
              <div className="text-sm text-gray-600">Total Conversions</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <div className="text-lg font-bold text-gray-900">{journeyInsights.avgSessionsPerPath?.toLocaleString() || 'N/A'}</div>
              <div className="text-sm text-gray-600">Avg Sessions per Path</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <div className="text-lg font-bold text-gray-900">{topPaths.length}</div>
              <div className="text-sm text-gray-600">Conversion Paths</div>
            </div>
          </div>

          {/* Top Performing Path Highlight */}
          {journeyInsights.topPerformingPath && (
            <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
              <h3 className="font-medium text-green-800 mb-2">🏆 Top Performing Path</h3>
              <p className="text-green-700 font-medium">{journeyInsights.topPerformingPath}</p>
              <p className="text-sm text-green-600 mt-1">This path generates the most conversions</p>
            </div>
          )}

          {/* Journey Optimization Tips */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-yellow-800 mb-3">💡 Journey Optimization Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-yellow-800 mb-2">High-Impact Opportunities:</h4>
                <ul className="space-y-1 text-yellow-700">
                  <li>• Optimize pages with high assists but low direct conversions</li>
                  <li>• Reduce friction in longest conversion paths</li>
                  <li>• Add conversion elements to popular assisting pages</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-yellow-800 mb-2">Quick Wins:</h4>
                <ul className="space-y-1 text-yellow-700">
                  <li>• Cross-link between top assisting and converting pages</li>
                  <li>• Add retargeting pixels for incomplete journeys</li>
                  <li>• Create nurture sequences for multi-touch users</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 