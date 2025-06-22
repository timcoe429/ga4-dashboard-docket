'use client';
import { useState } from 'react';
import { Calendar, Filter } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import TopPages from '../components/TopPages';
import BlogPosts from '../components/BlogPosts';
import ConvertingPages from '../components/ConvertingPages';
import FunnelChart from '../components/FunnelChart';

// Mock data - we'll replace with real GA4 data later
const mockData = {
  metrics: [
    { title: 'Total Sessions', value: '234,567', trend: 12.3, subtitle: 'Last 30 days' },
    { title: 'Conversions', value: '12,345', trend: 8.7, subtitle: 'Last 30 days' },
    { title: 'Conversion Rate', value: '5.26%', trend: -2.1, subtitle: 'Last 30 days' },
    { title: 'Revenue', value: '$789,012', trend: 15.4, subtitle: 'Last 30 days' }
  ],
  topPages: [
    { page: '/pricing', sessions: 45320, conversions: 2890, rate: 6.4, trend: 12.3 },
    { page: '/features', sessions: 38450, conversions: 1923, rate: 5.0, trend: 8.1 },
    { page: '/demo', sessions: 28900, conversions: 2312, rate: 8.0, trend: -2.4 },
    { page: '/solutions', sessions: 22100, conversions: 1105, rate: 5.0, trend: 15.7 },
    { page: '/', sessions: 98200, conversions: 2946, rate: 3.0, trend: 4.2 }
  ],
  blogPosts: [
    { title: 'Complete Guide to SEO in 2024', views: 12450, trend: 142, conversions: 186 },
    { title: 'How We Increased Revenue by 300%', views: 9820, trend: 89, conversions: 147 },
    { title: 'Marketing Automation Best Practices', views: 8200, trend: 234, conversions: 123 },
    { title: 'Customer Success Stories', views: 7100, trend: -12, conversions: 213 }
  ],
  convertingPages: [
    { page: '/demo', conversions: 2312, revenue: 184960, avgValue: 80 },
    { page: '/', conversions: 2946, revenue: 147300, avgValue: 50 },
    { page: '/pricing', conversions: 2890, revenue: 144500, avgValue: 50 },
    { page: '/case-studies/tech', conversions: 890, revenue: 89000, avgValue: 100 }
  ],
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
};

export default function Dashboard() {
  const [dateRange, setDateRange] = useState('last30days');

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
          {mockData.metrics.map((metric, i) => (
            <MetricCard key={i} {...metric} />
          ))}
        </div>

        {/* Top Pages */}
        <div className="mb-6">
          <TopPages data={mockData.topPages} />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <BlogPosts data={mockData.blogPosts} />
          <ConvertingPages data={mockData.convertingPages} />
        </div>

        {/* Funnel */}
        <div className="mb-6">
          <FunnelChart data={mockData.funnels} />
        </div>
      </div>
    </div>
  );
}
