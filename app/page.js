'use client';
import { useState, useEffect } from 'react';
import { Calendar, TrendingUp, BarChart3, Users, Target, RefreshCw, Eye, EyeOff } from 'lucide-react';
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
  
  // Section visibility state
  const [visibleSections, setVisibleSections] = useState({
    pages: true,
    blog: true,
    category: true,
    userJourney: true,
    abTesting: true
  });

  const sections = [
    { key: 'pages', label: 'Landing & Converting Pages', icon: Target },
    { key: 'blog', label: 'Blog Performance', icon: BarChart3 },
    { key: 'category', label: 'Category Performance', icon: TrendingUp },
    { key: 'userJourney', label: 'User Journey Intelligence', icon: Users },
    { key: 'abTesting', label: 'A/B Testing', icon: RefreshCw }
  ];

  const toggleSection = (sectionKey) => {
    setVisibleSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const toggleAllSections = (visible) => {
    const newState = {};
    sections.forEach(section => {
      newState[section.key] = visible;
    });
    setVisibleSections(newState);
  };
  
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

  // Mini dashboard components for collapsed sections
  const renderMiniDashboard = (sectionKey) => {
    switch (sectionKey) {
      case 'pages':
        return (
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm font-medium text-blue-800">Top Landing</div>
              <div className="text-lg font-bold text-blue-600">
                {data.pages[0]?.page_title || 'Homepage'}
              </div>
              <div className="text-xs text-blue-600">
                {data.pages[0]?.sessions.toLocaleString() || '0'} sessions
              </div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-sm font-medium text-green-800">Top Converting</div>
              <div className="text-lg font-bold text-green-600">
                {data.topConvertingPages[0]?.page_title || 'Demo Request'}
              </div>
              <div className="text-xs text-green-600">
                {data.topConvertingPages[0]?.conversion_rate || '0%'} rate
              </div>
            </div>
          </div>
        );
      case 'blog':
        return (
          <div className="bg-purple-50 p-3 rounded-lg mt-3">
            <div className="text-sm font-medium text-purple-800">Blog Performance</div>
            <div className="text-lg font-bold text-purple-600">
              {data.blogPosts?.length || 0} Posts Analyzed
            </div>
            <div className="text-xs text-purple-600">
              {data.blogPosts?.[0]?.sessions?.toLocaleString() || '0'} top sessions
            </div>
          </div>
        );
      case 'category':
        return (
          <div className="bg-orange-50 p-3 rounded-lg mt-3">
            <div className="text-sm font-medium text-orange-800">Category Insights</div>
            <div className="text-lg font-bold text-orange-600">
              {Object.keys(data.categoryPerformance).length || 0} Categories
            </div>
            <div className="text-xs text-orange-600">
              {data.highTrafficLowConversion?.length || 0} optimization opportunities
            </div>
          </div>
        );
      case 'userJourney':
        return (
          <div className="bg-indigo-50 p-3 rounded-lg mt-3">
            <div className="text-sm font-medium text-indigo-800">Journey Intelligence</div>
            <div className="text-lg font-bold text-indigo-600">
              {data.journeyData?.topPaths?.length || 0} Conversion Paths
            </div>
            <div className="text-xs text-indigo-600">
              {data.journeyData?.journeyInsights?.avgJourneyLength || '0'} avg steps
            </div>
          </div>
        );
      case 'abTesting':
        return (
          <div className="bg-pink-50 p-3 rounded-lg mt-3">
            <div className="text-sm font-medium text-pink-800">A/B Testing</div>
            <div className="text-lg font-bold text-pink-600">
              {data.abTestData?.activeTests?.length || 0} Active Tests
            </div>
            <div className="text-xs text-pink-600">Demo data available</div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🎯 Conversion Analysis Dashboard</h1>
          <p className="text-gray-600 mb-4">Actionable insights into what's driving conversions and what needs optimization</p>
          
          {/* Controls Row */}
          <div className="flex items-center gap-4 flex-wrap mb-6">
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

          {/* Section Navigation */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Dashboard Sections</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleAllSections(true)}
                  className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                >
                  Show All
                </button>
                <button
                  onClick={() => toggleAllSections(false)}
                  className="text-sm px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  Hide All
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {sections.map(section => {
                const Icon = section.icon;
                const isVisible = visibleSections[section.key];
                
                return (
                  <div
                    key={section.key}
                    className={`border rounded-lg p-4 transition-all cursor-pointer ${
                      isVisible 
                        ? 'border-blue-300 bg-blue-50' 
                        : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => toggleSection(section.key)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Icon className={`w-5 h-5 ${isVisible ? 'text-blue-600' : 'text-gray-500'}`} />
                      {isVisible ? (
                        <Eye className="w-4 h-4 text-blue-600" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <h4 className={`text-sm font-medium mb-1 ${
                      isVisible ? 'text-blue-900' : 'text-gray-700'
                    }`}>
                      {section.label}
                    </h4>
                    <p className={`text-xs ${isVisible ? 'text-blue-600' : 'text-gray-500'}`}>
                      {isVisible ? 'Visible' : 'Hidden'}
                    </p>
                    
                    {/* Mini Dashboard for Hidden Sections */}
                    {!isVisible && renderMiniDashboard(section.key)}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Metrics Grid - Always Visible */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {data.metrics.map((metric, i) => (
            <MetricCard key={i} {...metric} />
          ))}
        </div>

        {/* Conditional Sections Based on Visibility */}
        {visibleSections.pages && (
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
        )}

        {visibleSections.blog && visibleSections.category && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
            {visibleSections.blog && (
              <BlogPosts 
                data={data.blogPosts} 
                showComparison={compareMode}
              />
            )}
            {visibleSections.category && (
              <CategoryPerformance 
                categoryPerformance={data.categoryPerformance}
                highTrafficLowConversion={data.highTrafficLowConversion}
              />
            )}
          </div>
        )}

        {(visibleSections.blog && !visibleSections.category) && (
          <div className="mb-8">
            <BlogPosts 
              data={data.blogPosts} 
              showComparison={compareMode}
            />
          </div>
        )}

        {(!visibleSections.blog && visibleSections.category) && (
          <div className="mb-8">
            <CategoryPerformance 
              categoryPerformance={data.categoryPerformance}
              highTrafficLowConversion={data.highTrafficLowConversion}
            />
          </div>
        )}

        {/* User Journey Intelligence */}
        {visibleSections.userJourney && (
          <div className="mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">🗺️ User Journey Intelligence</h2>
              <p className="text-gray-600">See exactly how users navigate to conversions</p>
            </div>
            
            <div className="mb-8">
              <UserJourneyMap 
                journeyData={data.journeyData} 
                showComparison={compareMode}
              />
            </div>
          </div>
        )}

        {/* A/B Testing */}
        {visibleSections.abTesting && (
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
        )}

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
