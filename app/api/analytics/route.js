import { BetaAnalyticsDataClient } from '@google-analytics/data';

const propertyId = process.env.GA4_PROPERTY_ID;

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
});

export async function GET() {
  try {
    // First, let's just get basic page views to make sure connection works
    const [pagesResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'pagePath' }],  // Changed to pagePath
      metrics: [
        { name: 'screenPageViews' },  // Changed to screenPageViews
        { name: 'activeUsers' }       // Changed to activeUsers
      ],
      limit: 10,
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
    });

    console.log('GA4 Response:', pagesResponse); // Add logging

    const pages = pagesResponse.rows?.map(row => ({
      page: row.dimensionValues[0].value,
      sessions: parseInt(row.metricValues[0].value) || 0,
      conversions: parseInt(row.metricValues[1].value) || 0,
      rate: 0,
      trend: Math.random() * 20 - 10,
    })) || [];

    // Also return row count for debugging
    return Response.json({ 
      pages,
      debug: {
        rowCount: pagesResponse.rowCount || 0,
        hasData: pages.length > 0
      }
    });
  } catch (error) {
    console.error('GA4 API Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
