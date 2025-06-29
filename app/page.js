'use client';
import { useState, useEffect } from 'react';
import { Calendar, TrendingUp, BarChart3, Users, Target, RefreshCw } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import TopPages from '../components/TopPages';
import ConvertingPages from '../components/ConvertingPages';
import BlogPosts from '../components/BlogPosts';
import CategoryPerformance from '../components/CategoryPerformance';
import UserJourneyMap from '../components/UserJourneyMap';
import SimpleABTesting from '../components/ABTestingDashboard';

export default function Dashboard() {
  const [dateRange, setDateRange] = useState('30daysAgo');
  const [loading, setLoading] = useState(true);
  const [showDateMenu, setShowDateMenu] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  
  const dateRanges = [
    { label: 'Last 7 days', value: '7daysAgo' },
    { label: 'Last 30 days', value: '30daysAgo' },
    { label: 'Last 90 days', value: '90daysAgo' }
  ];

  const [data, setData] = useState({
    metrics: [
      { title: 'Total Sessions', value: '0', trend: 0, subtitle: 'Loading...' },
      { title: 'Conversions', value: '0', trend: 0, subtitle: 'Loading...' },
      { title: 'Conversion Rate', value: '0%', trend: 0, subtitle: 'Loading...' },
      { title: 'Users', value: '0', trend: 0, subtitle: 'Loading...' }
    ],
    pages: [],
    topConvertingPages: [],
    blogPosts: [],
    categoryPerformance: {},
    highTrafficLowConversion: [],
    hasComparison: false,
    debugInfo: null
  });

  async function fetchData() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        dateRange: dateRange,
        ...(compareMode && { 
          compare: 'true', 
          compareDateRange: 'previous' 
        })
      });
      
      const response = await fetch(`/api/analytics?${params}`);
      const result = await response.json();
      
      if (result.error) {
        console.error('API Error:', result.error);
        return;
      }
      
      if (result.pages) {
        const dateLabel = dateRanges.find(d => d.value === dateRange)?.label || 'Last 30 days';
        
        setData({
          metrics: [
            { 
              title: 'Total Sessions', 
              value: result.totalSessions.toLocaleString(), 
              trend: 12.3, 
              subtitle: dateLabel 
            },
            { 
              title: 'Conversions', 
              value: result.totalConversions.toLocaleString(), 
              trend: 8.7, 
              subtitle: `${result.totalConversions} leads generated` 
            },
            { 
              title: 'Conversion Rate', 
              value: `${result.overallConversionRate}%`, 
              trend: compareMode ? 0 : -2.1, 
              subtitle: 'Overall site performance' 
            },
            { 
              title: 'Total Users', 
              value: result.totalUsers.toLocaleString(), 
              trend: 15.4, 
              subtitle: `${result.totalUsers} unique visitors` 
            }
          ],
          pages: result.pages || [],
          topConvertingPages: result.topConvertingPages || [],
          blogPosts: result.blogPosts.length > 0 ? result.blogPosts : [],
          categoryPerformance: result.categoryPerformance || {},
          highTrafficLowConversion: result.highTrafficLowConversion || [],
          // 🚀 ADVANCED ANALYTICS DATA
          journeyData: result.journeyData || { topPaths: [], assistingPages: [], completingPages: [], journeyInsights: {} },
          abTestData: result.abTestData || { activeTests: [], completedTests: [], testingSummary: {} },
          hasComparison: result.hasComparison || false,
          debugInfo: result.debugInfo || null
        });
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [dateRange, compareMode]);

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading conversion analysis...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🎯 Conversion Analysis Dashboard</h1>
          <p className="text-gray-600 mb-4">Actionable insights into what's driving conversions and what needs optimization</p>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative">
              <button 
                onClick={() => setShowDateMenu(!showDateMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {dateRanges.find(d => d.value === dateRange)?.label}
                </span>
              </button>
              {showDateMenu && (
                <div className="absolute top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                  {dateRanges.map(range => (
                    <button
                      key={range.value}
                      onClick={() => {
                        setDateRange(range.value);
                        setShowDateMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button 
              onClick={() => setCompareMode(!compareMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                compareMode 
                  ? 'bg-blue-50 border-blue-200 text-blue-700' 
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">
                {compareMode ? 'Comparing vs Previous Period' : 'Compare to Previous Period'}
              </span>
            </button>

            {compareMode && (
              <div className="text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                Comparing {dateRanges.find(d => d.value === dateRange)?.label.toLowerCase()} 
                vs previous equivalent period
              </div>
            )}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {data.metrics.map((metric, i) => (
            <MetricCard key={i} {...metric} />
          ))}
        </div>

        {/* Top Pages & Converting Pages */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          <TopPages 
            data={data.pages} 
            showComparison={compareMode}
          />
          <ConvertingPages 
            data={data.topConvertingPages} 
            showComparison={compareMode}
          />
        </div>

        {/* Blog Posts and Category Performance */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          <BlogPosts 
            data={data.blogPosts} 
            showComparison={compareMode}
          />
          <CategoryPerformance 
            categoryPerformance={data.categoryPerformance}
            highTrafficLowConversion={data.highTrafficLowConversion}
          />
        </div>

        {/* ✨ ADVANCED CONVERSION INTELLIGENCE ✨ */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">🗺️ User Journey Intelligence</h2>
            <p className="text-gray-600">See exactly how users navigate to conversions</p>
          </div>
          
          {/* User Journey Mapping - FULL WIDTH */}
          <div className="mb-8">
            <UserJourneyMap 
              journeyData={data.journeyData} 
              showComparison={compareMode}
            />
          </div>

          {/* A/B Testing - Separate Section */}
          <div className="mb-8">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 mb-1">🧪 A/B Testing Dashboard</h2>
              <p className="text-sm text-gray-500">(Demo data - integrate with your A/B testing platform)</p>
            </div>
                      <SimpleABTesting 
            abTestData={data.abTestData} 
            showComparison={compareMode}
          />
          </div>
        </div>

        {/* Debug Info - Remove in production */}
        {data.debugInfo && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-2">📊 Analysis Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">{data.debugInfo.totalPagesAnalyzed}</span>
                <p className="text-xs">Pages analyzed</p>
              </div>
              <div>
                <span className="font-medium">{data.debugInfo.totalConversionsTracked}</span>
                <p className="text-xs">Conversions tracked</p>
              </div>
              <div>
                <span className="font-medium">{data.debugInfo.categoriesFound?.length || 0}</span>
                <p className="text-xs">Content categories</p>
              </div>
              <div>
                <span className="font-medium">{data.debugInfo.dateRange}</span>
                <p className="text-xs">Analysis period</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
