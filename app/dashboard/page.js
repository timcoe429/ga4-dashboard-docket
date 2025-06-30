'use client';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Calendar, TrendingUp, BarChart3, Users, Target, RefreshCw, Eye, EyeOff, ChevronRight, ChevronLeft, Settings, Building2, LogOut } from 'lucide-react';
import MetricCard from '../../components/MetricCard';
import TopPages from '../../components/TopPages';
import ConvertingPages from '../../components/ConvertingPages';
import BlogPosts from '../../components/BlogPosts';
import CategoryPerformance from '../../components/CategoryPerformance';
import UserJourneyMap from '../../components/UserJourneyMap';
import SimpleABTesting from '../../components/ABTestingDashboard';
import AmericanFooter from '../../components/AmericanFooter';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [dateRange, setDateRange] = useState('30daysAgo');
  const [loading, setLoading] = useState(true);
  const [showDateMenu, setShowDateMenu] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  
  // Property selection state
  const [currentProperty, setCurrentProperty] = useState('docket');
  const [showPropertyMenu, setShowPropertyMenu] = useState(false);
  
  // Floating navigation state
  const [showFloatingNav, setShowFloatingNav] = useState(false);
  const [isFloatingNavExpanded, setIsFloatingNavExpanded] = useState(false);
  const [showFloatingDateMenu, setShowFloatingDateMenu] = useState(false);
  const [showFloatingPropertyMenu, setShowFloatingPropertyMenu] = useState(false);
  
  // Section visibility state
  const [visibleSections, setVisibleSections] = useState({
    pages: true,
    blog: true,
    category: true,
    userJourney: true,
    abTesting: true
  });

  const properties = [
    { 
      key: 'docket', 
      label: 'Docket', 
      domain: 'yourdocket.com',
      color: 'blue',
      icon: BarChart3 
    },
    { 
      key: 'servicecore', 
      label: 'ServiceCore', 
      domain: 'servicecore.com',
      color: 'green',
      icon: Target 
    }
  ];

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

  // Scroll detection for floating nav
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setShowFloatingNav(scrollTop > 300);
      
      if (scrollTop <= 300) {
        setIsFloatingNavExpanded(false);
        setShowFloatingDateMenu(false);
        setShowFloatingPropertyMenu(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
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
        property: currentProperty,
        ...(compareMode && { 
          compare: 'true', 
          compareDateRange: 'previous' 
        })
      });
      
      console.log('🔍 Fetching data for property:', currentProperty);
      console.log('📡 API URL:', `/api/analytics?${params}`);
      
      const response = await fetch(`/api/analytics?${params}`);
      const result = await response.json();
      
      console.log('📊 API Response:', result);
      
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
    if (session) {
      fetchData();
    }
  }, [dateRange, compareMode, currentProperty, session]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading conversion analysis...</div>
      </div>
    );
  }

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
                {data.pages[0]?.sessions?.toLocaleString() || '0'} sessions
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
              {data.blogPosts?.length || 0} Posts
            </div>
            <div className="text-xs text-purple-600">
              {data.blogPosts?.[0]?.sessions?.toLocaleString() || '0'} top sessions
            </div>
          </div>
                );
      case 'category':
        return (
          <div className="bg-orange-50 p-3 rounded-lg mt-3">
            <div className="text-sm font-medium text-orange-800">Categories</div>
            <div className="text-lg font-bold text-orange-600">
              {Object.keys(data.categoryPerformance).length || 0}
            </div>
            <div className="text-xs text-orange-600">
              {data.highTrafficLowConversion?.length || 0} opportunities
            </div>
          </div>
        );
      case 'userJourney':
        return (
          <div className="bg-indigo-50 p-3 rounded-lg mt-3">
            <div className="text-sm font-medium text-indigo-800">Journey Paths</div>
            <div className="text-lg font-bold text-indigo-600">
              {data.journeyData?.topPaths?.length || 0}
            </div>
            <div className="text-xs text-indigo-600">
              {data.journeyData?.journeyInsights?.avgJourneyLength || '0'} avg steps
            </div>
          </div>
        );
      case 'abTesting':
        return (
          <div className="bg-pink-50 p-3 rounded-lg mt-3">
            <div className="text-sm font-medium text-pink-800">A/B Tests</div>
            <div className="text-lg font-bold text-pink-600">
              {data.abTestData?.activeTests?.length || 0}
            </div>
            <div className="text-xs text-pink-600">Demo data</div>
          </div>
        );
      default:
        return null;
    }
  };

  const currentProp = properties.find(p => p.key === currentProperty);

  return (
    <>
      {/* Floating Navigation Sidebar */}
      {showFloatingNav && (
        <div className={`fixed right-0 top-1/2 transform -translate-y-1/2 z-50 transition-all duration-300 ${
          isFloatingNavExpanded ? 'translate-x-0' : 'translate-x-80'
        }`}>
          <div className="bg-white shadow-2xl rounded-l-xl border border-gray-200 w-80">
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">Dashboard Controls</h3>
                </div>
                <button
                  onClick={() => setIsFloatingNavExpanded(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4">
              {/* Property Selector */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Property</label>
                <div className="relative">
                  <button 
                    onClick={() => setShowFloatingPropertyMenu(!showFloatingPropertyMenu)}
                    className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium">
                        {currentProp?.label} ({currentProp?.domain})
                      </span>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${showFloatingPropertyMenu ? 'rotate-90' : ''}`} />
                  </button>
                  {showFloatingPropertyMenu && (
                    <div className="absolute top-full mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                      {properties.map(property => (
                        <button
                          key={property.key}
                          onClick={() => {
                            setCurrentProperty(property.key);
                            setShowFloatingPropertyMenu(false);
                          }}
                          className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <property.icon className="w-4 h-4" />
                            <span>{property.label}</span>
                          </div>
                          <div className="text-xs text-gray-500 ml-6">{property.domain}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Date Range Selector */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Time Period</label>
                <div className="relative">
                  <button 
                    onClick={() => setShowFloatingDateMenu(!showFloatingDateMenu)}
                    className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium">
                        {dateRanges.find(d => d.value === dateRange)?.label}
                      </span>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${showFloatingDateMenu ? 'rotate-90' : ''}`} />
                  </button>
                  {showFloatingDateMenu && (
                    <div className="absolute top-full mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                      {dateRanges.map(range => (
                        <button
                          key={range.value}
                          onClick={() => {
                            setDateRange(range.value);
                            setShowFloatingDateMenu(false);
                          }}
                          className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors"
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Comparison Toggle */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Comparison</label>
                <button 
                  onClick={() => setCompareMode(!compareMode)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                    compareMode 
                      ? 'bg-blue-50 border-blue-200 text-blue-700' 
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {compareMode ? 'Comparing vs Previous' : 'Compare to Previous'}
                  </span>
                </button>
              </div>

              {/* Section Toggles */}
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 mb-3 block">Dashboard Sections</label>
                
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => toggleAllSections(true)}
                    className="flex-1 text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                  >
                    Show All
                  </button>
                  <button
                    onClick={() => toggleAllSections(false)}
                    className="flex-1 text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                  >
                    Hide All
                  </button>
                </div>

                <div className="space-y-2">
                  {sections.map(section => {
                    const Icon = section.icon;
                    const isVisible = visibleSections[section.key];
                    
                    return (
                      <button
                        key={section.key}
                        onClick={() => toggleSection(section.key)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-all ${
                          isVisible 
                            ? 'border-blue-200 bg-blue-50 text-blue-900' 
                            : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className={`w-4 h-4 ${isVisible ? 'text-blue-600' : 'text-gray-500'}`} />
                          <span className="text-sm font-medium">{section.label}</span>
                        </div>
                        {isVisible ? (
                          <Eye className="w-4 h-4 text-blue-600" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsFloatingNavExpanded(!isFloatingNavExpanded)}
            className={`absolute top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
              isFloatingNavExpanded ? 'left-0 -translate-x-full' : 'left-0 -translate-x-full'
            } bg-blue-600 hover:bg-blue-700 text-white px-2 py-4 rounded-l-lg shadow-lg`}
          >
            <ChevronLeft className={`w-5 h-5 transition-transform ${isFloatingNavExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      )}

    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">🎯 Analytics Hub</h1>
              <p className="text-gray-600">Multi-property conversion analysis and insights</p>
            </div>
            
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Sign Out</span>
            </button>
          </div>
          
          {/* Controls Row */}
          <div className="flex items-center gap-4 flex-wrap mb-6">
            {/* Property Selector */}
            <div className="relative">
              <button 
                onClick={() => setShowPropertyMenu(!showPropertyMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                <Building2 className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {currentProp?.label}
                </span>
                <span className="text-xs text-gray-500">
                  ({currentProp?.domain})
                </span>
              </button>
              {showPropertyMenu && (
                <div className="absolute top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10 min-w-48">
                  {properties.map(property => (
                    <button
                      key={property.key}
                      onClick={() => {
                        setCurrentProperty(property.key);
                        setShowPropertyMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      <div className="flex items-center gap-2">
                        <property.icon className="w-4 h-4" />
                        <span className="font-medium">{property.label}</span>
                      </div>
                      <div className="text-xs text-gray-500 ml-6">{property.domain}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

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
                    
                    {!isVisible && renderMiniDashboard(section.key)}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {data.metrics.map((metric, i) => (
            <MetricCard key={i} {...metric} />
          ))}
        </div>

        {/* Conditional Sections */}
        {visibleSections.pages && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
            <TopPages data={data.pages} showComparison={compareMode} />
            <ConvertingPages data={data.topConvertingPages} showComparison={compareMode} />
          </div>
        )}

        {visibleSections.blog && visibleSections.category && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
            <BlogPosts data={data.blogPosts} showComparison={true} />
            <CategoryPerformance 
              categoryPerformance={data.categoryPerformance}
              highTrafficLowConversion={data.highTrafficLowConversion}
            />
          </div>
        )}

        {(visibleSections.blog && !visibleSections.category) && (
          <div className="mb-8">
            <BlogPosts data={data.blogPosts} showComparison={true} />
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



        {visibleSections.userJourney && (
          <div className="mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">🗺️ User Journey Intelligence</h2>
              <p className="text-gray-600">See exactly how users navigate to conversions on {currentProp?.domain}</p>
            </div>
            
            <div className="mb-8">
              <UserJourneyMap journeyData={data.journeyData} showComparison={compareMode} />
            </div>
          </div>
        )}

        {visibleSections.abTesting && (
          <div className="mb-8">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 mb-1">🧪 A/B Testing Dashboard</h2>
              <p className="text-sm text-gray-500">(Demo data - integrate with your A/B testing platform)</p>
            </div>
            <SimpleABTesting abTestData={data.abTestData} showComparison={compareMode} />
          </div>
        )}



        {/* Footer */}
        <AmericanFooter />
      </div>
    </div>
    </>
  );
} 