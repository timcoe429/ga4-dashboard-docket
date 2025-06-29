'use client';
import { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Play, Pause, CheckCircle, XCircle, Calendar, BarChart3 } from 'lucide-react';

export default function SimpleABTesting({ abTestData, showComparison = false }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAddTest, setShowAddTest] = useState(false);
  const [newTest, setNewTest] = useState({
    url: '',
    testName: '',
    description: ''
  });

  // Simple demo data - replace with real database integration
  const [activeTests, setActiveTests] = useState([
    {
      id: 1,
      testName: 'Homepage CTA Update',
      url: '/',
      description: 'Testing new "Get Started Free" button',
      startDate: '2024-01-01',
      status: 'running',
      daysRunning: 8,
      controlPeriod: {
        sessions: 1250,
        conversions: 32,
        conversionRate: 2.56,
        period: 'Dec 15-29, 2023'
      },
      testPeriod: {
        sessions: 1180,
        conversions: 41,
        conversionRate: 3.47,
        period: 'Jan 1-15, 2024'
      }
    },
    {
      id: 2,
      testName: 'Pricing Page Simplification',
      url: '/pricing',
      description: 'Removed enterprise tier, simplified layout',
      startDate: '2024-01-05',
      status: 'running', 
      daysRunning: 4,
      controlPeriod: {
        sessions: 856,
        conversions: 28,
        conversionRate: 3.27,
        period: 'Dec 20-Jan 3'
      },
      testPeriod: {
        sessions: 420,
        conversions: 18,
        conversionRate: 4.29,
        period: 'Jan 5-present'
      }
    }
  ]);

  const handleAddTest = () => {
    if (newTest.url && newTest.testName) {
      const test = {
        id: Date.now(),
        testName: newTest.testName,
        url: newTest.url,
        description: newTest.description,
        startDate: new Date().toISOString().split('T')[0],
        status: 'starting',
        daysRunning: 0,
        controlPeriod: {
          sessions: 0,
          conversions: 0,
          conversionRate: 0,
          period: 'Previous 14 days (calculating...)'
        },
        testPeriod: {
          sessions: 0,
          conversions: 0,
          conversionRate: 0,
          period: 'Starting today'
        }
      };
      
      setActiveTests([...activeTests, test]);
      setNewTest({ url: '', testName: '', description: '' });
      setShowAddTest(false);
    }
  };

  const calculateUplift = (test) => {
    if (test.controlPeriod.conversionRate === 0) return 0;
    return ((test.testPeriod.conversionRate - test.controlPeriod.conversionRate) / test.controlPeriod.conversionRate * 100);
  };

  const getTestStatus = (test) => {
    if (test.status === 'starting') return 'setting-up';
    if (test.daysRunning < 7) return 'early';
    if (test.daysRunning >= 14) return 'complete';
    return 'running';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">🧪 Simple A/B Testing</h2>
          <p className="text-sm text-gray-500">Track URL performance changes over 14-day periods</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddTest(!showAddTest)}
            className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Test
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 px-2 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <>
          {/* Add New Test Form */}
          {showAddTest && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-3">Create New A/B Test</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL to Test</label>
                  <input
                    type="text"
                    value={newTest.url}
                    onChange={(e) => setNewTest({...newTest, url: e.target.value})}
                    placeholder="/pricing"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Test Name</label>
                  <input
                    type="text"
                    value={newTest.testName}
                    onChange={(e) => setNewTest({...newTest, testName: e.target.value})}
                    placeholder="Pricing Page Update"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">What are you testing?</label>
                <input
                  type="text"
                  value={newTest.description}
                  onChange={(e) => setNewTest({...newTest, description: e.target.value})}
                  placeholder="New button colors and copy"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddTest}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Start Test
                </button>
                <button
                  onClick={() => setShowAddTest(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
              <div className="mt-3 p-3 bg-blue-100 rounded text-sm text-blue-800">
                <strong>How it works:</strong> We'll pull the last 14 days of data for this URL as your "control" baseline. 
                Then track the next 14 days as your "test" version to compare performance.
              </div>
            </div>
          )}

          {/* Active Tests */}
          <div className="space-y-4">
            {activeTests.map((test) => {
              const status = getTestStatus(test);
              const uplift = calculateUplift(test);
              
              return (
                <div key={test.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{test.testName}</h3>
                      <p className="text-sm text-gray-600">{test.url}</p>
                      {test.description && (
                        <p className="text-sm text-gray-500 mt-1">{test.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        status === 'complete' ? 'bg-green-100 text-green-800' :
                        status === 'running' ? 'bg-blue-100 text-blue-800' :
                        status === 'early' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {status === 'complete' ? 'Complete' :
                         status === 'running' ? 'Running' :
                         status === 'early' ? 'Early Stage' : 'Setting Up'}
                      </span>
                      <span className="text-sm text-gray-500">Day {test.daysRunning}/14</span>
                    </div>
                  </div>

                  {/* Performance Comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Control Period */}
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Control (Before)</h4>
                      <div className="text-xs text-gray-500 mb-2">{test.controlPeriod.period}</div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Sessions:</span>
                          <span className="font-medium">{test.controlPeriod.sessions.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Conversions:</span>
                          <span className="font-medium">{test.controlPeriod.conversions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Conv. Rate:</span>
                          <span className="font-bold text-lg">{test.controlPeriod.conversionRate}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Test Period */}
                    <div className={`p-3 rounded-lg ${
                      uplift > 0 ? 'bg-green-50 border border-green-200' : 
                      uplift < 0 ? 'bg-red-50 border border-red-200' : 'bg-blue-50'
                    }`}>
                      <h4 className="font-medium text-gray-900 mb-2">Test (After)</h4>
                      <div className="text-xs text-gray-500 mb-2">{test.testPeriod.period}</div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Sessions:</span>
                          <span className="font-medium">{test.testPeriod.sessions.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Conversions:</span>
                          <span className="font-medium">{test.testPeriod.conversions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Conv. Rate:</span>
                          <span className="font-bold text-lg">{test.testPeriod.conversionRate}%</span>
                        </div>
                        {test.testPeriod.conversionRate > 0 && (
                          <div className="flex justify-between pt-2 border-t">
                            <span className="text-sm font-medium">Change:</span>
                            <span className={`font-bold ${uplift > 0 ? 'text-green-600' : uplift < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                              {uplift > 0 ? '+' : ''}{uplift.toFixed(1)}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Test Recommendations */}
                  <div className="mt-4 p-3 bg-gray-50 rounded">
                    <div className="text-sm">
                      {status === 'setting-up' && (
                        <span className="text-gray-600">⏳ Setting up test - gathering baseline data from previous 14 days...</span>
                      )}
                      {status === 'early' && (
                        <span className="text-yellow-700">⚠️ Test is still early - wait until day 7+ for reliable results</span>
                      )}
                      {status === 'running' && uplift > 10 && (
                        <span className="text-green-700">✅ Strong positive results! Consider implementing this change.</span>
                      )}
                      {status === 'running' && uplift < -10 && (
                        <span className="text-red-700">❌ Negative impact detected. Consider reverting changes.</span>
                      )}
                      {status === 'running' && Math.abs(uplift) <= 10 && (
                        <span className="text-blue-700">📊 Test running normally. Continue monitoring for clear results.</span>
                      )}
                      {status === 'complete' && (
                        <span className={uplift > 0 ? 'text-green-700' : 'text-red-700'}>
                          🏁 Test complete! {uplift > 0 ? 'Implement winning version.' : 'Revert to original version.'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {activeTests.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No active tests. Click "Add Test" to start tracking URL performance changes.</p>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">💡 How Simple A/B Testing Works</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p><strong>1. Add URL:</strong> Enter any page URL you want to test</p>
              <p><strong>2. Control Period:</strong> We automatically pull the previous 14 days as your baseline</p>
              <p><strong>3. Test Period:</strong> Make your changes, then track the next 14 days</p>
              <p><strong>4. Compare Results:</strong> See if your changes improved conversion rates</p>
              <p><strong>Best for:</strong> Major page changes, new designs, significant copy updates</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 