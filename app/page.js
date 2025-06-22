'use client';
import { useState, useEffect } from 'react';
import { Calendar, Filter } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import TopPages from '../components/TopPages';
import BlogPosts from '../components/BlogPosts';
import ConvertingPages from '../components/ConvertingPages';
import FunnelChart from '../components/FunnelChart';

export default function Dashboard() {
  const [dateRange, setDateRange] = useState('last30days');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    metrics: [
      { title: 'Total Sessions', value: '0', trend: 0, subtitle: 'Last 30 days' },
      { title: 'Conversions', value: '0', trend: 0, subtitle: 'Last 30 days' },
      { title: 'Conversion Rate', value: '0%', trend: 0, subtitle: 'Last 30 days' },
      { title: 'Revenue', value: '$0', trend: 0, subtitle: 'Last 30 days' }
    ],
    topPages: [],
    blogPosts: [
      { title: 'Loading...', views: 0, trend: 0, conversions: 0 }
    ],
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

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/analytics');
        const result = await response.json();
        
        if (result.pages) {
          // Calculate totals
          const totalSessions = result.pages.reduce((sum, page) => sum + page.sessions, 0);
          const totalConversions = result.pages.reduce((sum, page) => sum + page.conversions, 0);
          const avgRate = totalSessions > 0 ? ((totalConversions / totalSessions) * 100).toFixed(2) : 0;
          
          setData(prevData => ({
            ...prevData,
            metrics: [
              { title: 'Total Sessions', value: totalSessions.toLocaleString(), trend: 12.3, subtitle: 'Last 30 days' },
              { title: 'Conversions', value: totalConversions.toLocaleString(), trend: 8.7, subtitle: 'Last 30 days' },
              { title: 'Conversion Rate', value: `${avgRate}%`, trend: -2.1, subtitle: 'Last 30 days' },
              { title: 'Revenue', value: '$0', trend: 0, subtitle: 'Last 30 days' }
            ],
            topPages: result.pages.slice(0, 5),
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
            blogPosts: result.pages
              .filter(page => page.page.includes('/blog') || page.page.includes('/post'))
              .slice(0, 4)
              .map(page => ({
                title: page.page.replace('/blog/', '').replace('/post/', '').replace(/-/g, ' '),
                views: page.sessions,
                trend: Math.round(Math.random() * 200 - 50),
                conversions: page.conversions
              }))
          }));
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

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
            <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">Last 30 days</span>
            </button>
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
