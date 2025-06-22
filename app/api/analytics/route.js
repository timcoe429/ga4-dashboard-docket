import { BetaAnalyticsDataClient } from '@google-analytics/data';

export async function GET() {
  try {
    const propertyId = process.env.GA4_PROPERTY_ID;
    
    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
    });

    // Get page data with conversions
    const [pagesResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'eventCount' }
      ],
      dimensionFilter: {
        filter: {
          fieldName: 'pagePath',
          stringFilter: {
            matchType: 'DOES_NOT_CONTAIN',
            value: 'auth'
          }
        }
      },
      limit: 50,
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }]
    });

    // Get conversion events specifically
    const [conversionsResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'eventCount' }],
      dimensionFilter: {
        filter: {
          fieldName: 'eventName',
          stringFilter: {
            value: 'generate_lead_docket'
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

    // Process pages
    const pages = pagesResponse.rows?.map(row => {
      const pagePath = row.dimensionValues[0].value;
      const pageViews = parseInt(row.metricValues[0].value) || 0;
      const conversions = conversionsByPage[pagePath] || 0;
      
      return {
        page: pagePath,
        sessions: pageViews,
        conversions: conversions,
        rate: pageViews > 0 ? ((conversions / pageViews) * 100).toFixed(1) : 0,
        trend: Math.random() * 20 - 10 // Mock trend for now
      };
    }) || [];

    // Filter blog posts
    const blogPosts = pages
      .filter(page => 
        page.page.includes('/blog') || 
        page.page.includes('/post') || 
        page.page.includes('/article')
      )
      .slice(0, 4);

    return Response.json({ 
      pages: pages.filter(p => !p.page.includes('auth')).slice(0, 10),
      blogPosts: blogPosts,
      totalConversions: Object.values(conversionsByPage).reduce((sum, val) => sum + val, 0)
    });
    
  } catch (error) {
    console.error('GA4 API Error:', error);
    return Response.json({ 
      error: error.message,
      code: error.code
    }, { status: 500 });
  }
}
