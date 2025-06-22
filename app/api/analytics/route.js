import { BetaAnalyticsDataClient } from '@google-analytics/data';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateRange = searchParams.get('dateRange') || '30daysAgo';
    
    const propertyId = process.env.GA4_PROPERTY_ID;
    
    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
    });

    // Get page data
    const [pagesResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: dateRange, endDate: 'today' }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'activeUsers' }
      ],
      limit: 50,
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }]
    });

    // Get conversion events
    const [conversionsResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: dateRange, endDate: 'today' }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'eventCount' }],
      dimensionFilter: {
        filter: {
          fieldName: 'eventName',
          stringFilter: {
            value: 'generate_lead_docket',
            matchType: 'EXACT'
          }
        }
      },
      limit: 20,
      orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }]
    });

    // Map conversions by page
    const conversionsByPage = {};
    conversionsResponse.rows?.forEach(row => {
      conversionsByPage[row.dimensionValues[0].value] = parseInt(row.metricValues[0].value) || 0;
    });

    // Process all pages, filter auth pages later
    const allPages = pagesResponse.rows?.map(row => {
      const pagePath = row.dimensionValues[0].value;
      const pageViews = parseInt(row.metricValues[0].value) || 0;
      const conversions = conversionsByPage[pagePath] || 0;
      
      return {
        page: pagePath,
        sessions: pageViews,
        conversions: conversions,
        rate: pageViews > 0 ? ((conversions / pageViews) * 100).toFixed(1) : 0,
        trend: Math.random() * 20 - 10
      };
    }) || [];

    // Filter out auth pages from display
    const displayPages = allPages.filter(p => 
      !p.page.includes('/_/auth') && 
      !p.page.includes('/auth/') &&
      !p.page.includes('iframe')
    );

    // Get blog posts
    const blogPosts = allPages
      .filter(page => 
        page.page.includes('/blog') || 
        page.page.includes('/post') || 
        page.page.includes('/article') ||
        page.page.includes('/how-')
      )
      .slice(0, 4);

    // Calculate totals from all pages (including auth for accurate total)
    const totalSessions = allPages.reduce((sum, page) => sum + page.sessions, 0);
    const totalConversions = Object.values(conversionsByPage).reduce((sum, val) => sum + val, 0);

    return Response.json({ 
      pages: displayPages.slice(0, 10),
      blogPosts: blogPosts,
      totalConversions: totalConversions,
      totalSessions: totalSessions,
      topPageViews: displayPages[0]?.sessions || 0,
      topPagePath: displayPages[0]?.page || 'No data'
    });
    
  } catch (error) {
    console.error('GA4 API Error:', error);
    return Response.json({ 
      error: error.message,
      code: error.code
    }, { status: 500 });
  }
}
