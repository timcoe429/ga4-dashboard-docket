'use client';
import { useState, useEffect } from 'react';
import { Calendar, Filter } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import TopPages from '../components/TopPages';
import BlogPosts from '../components/BlogPosts';
import ConvertingPages from '../components/ConvertingPages';
import FunnelChart from '../components/FunnelChart';

export default function Dashboard() {
  const [dateRange, setDateRange] = useState('30daysAgo');
  const [loading, setLoading] = useState(true);
  const [showDateMenu, setShowDateMenu] = useState(false);
  
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
      { title: 'Top Page Views', value: '0', trend: 0, subtitle: 'Loading...' }
    ],
    topPages: [],
    blogPosts: [],
    convertingPages: [],
    funnels: {
      signup: [
        { step: 'Landing Page', users: 10000, rate: 100 },
        { step: 'Signup Form', users: 4500, rate: 45 },
        { step: 'Email Verify', users: 3800, rate: 38 },
        { step: 'Complete Profile', users: 2900, rate: 29 },
        { step: 'First Action', users: 2100, rate: 21 }
      ],
      purchase: [
        { step: 'Product Page', users: 8000, rate: 100 },
        { step: 'Add to Cart', users: 2400, rate: 30 },
        { step: 'Checkout', users: 1680, rate: 21 },
        { step: 'Payment', users: 1344, rate: 16.8 },
        { step: 'Success', users: 1210, rate: 15.1 }
      ]
    }
  });

  async function fetchData() {
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics?dateRange=${dateRange}`);
      const result = await response.json();
      
      if (result.pages) {
        const totalSessions = result.totalSessions || 0;
        const totalConversions = result.totalConversions || 0;
        const avgRate = totalSessions > 0 ? ((totalConversions / totalSessions) * 100).toFixed(2) : 0;
        const dateLabel = dateRanges.find(d => d.value === dateRange)?.label || 'Last 30 days';
        
        setData(prevData => ({
          ...prevData,
          metrics: [
            { title: 'Total Sessions', value: totalSessions.toLocaleString(), trend: 12.3, subtitle: dateLabel },
            { title: 'Conversions', value: totalConversions.toLocaleString(), trend: 8.7, subtitle: dateLabel },
            { title: 'Conversion Rate', value: `${avgRate}%`, trend: -2.1, subtitle: dateLabel },
            { title: 'Top Page Views', value: result.topPageViews.toLocaleString(), trend: 15.4, subtitle: result.topPagePath }
          ],
          topPages: result.pages || [],
          convertingPages: result.pages
            .filter(page => page.conversions > 0)
            .sort((a, b) => b.conversions - a.conversions)
            .slice(0, 4)
            .map(page => ({
              page: page.page,
              conversions: page.conversions,
              revenue: page.conversions * 50,
              avgValue: 50
            })),
          blogPosts: result.blogPosts.length > 0 ? result.blogPosts : [
            { title: 'No blog posts found', views: 0, trend: 0, conversions: 0 }
          ]
        }));
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading analytics data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <div className="flex items-center gap-4">
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
            <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filters</span>
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {data.metrics.map((metric, i) => (
            <MetricCard key={i} {...metric} />
          ))}
        </div>

        {/* Top Pages */}
        <div className="mb-6">
          <TopPages data={data.topPages} />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <BlogPosts data={data.blogPosts} />
          <ConvertingPages data={data.convertingPages} />
        </div>

        {/* Funnel */}
        <div className="mb-6">
          <FunnelChart data={data.funnels} />
        </div>
      </div>
    </div>
  );
}
