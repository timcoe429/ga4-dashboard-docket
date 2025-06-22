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
    // Get top landing pages
    const [pagesResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'landingPagePlusQueryString' }],
      metrics: [
        { name: 'sessions' },
        { name: 'conversions' },
      ],
      limit: 10,
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    });

    const pages = pagesResponse.rows?.map(row => ({
      page: row.dimensionValues[0].value,
      sessions: parseInt(row.metricValues[0].value),
      conversions: parseInt(row.metricValues[1].value),
      rate: ((parseInt(row.metricValues[1].value) / parseInt(row.metricValues[0].value)) * 100).toFixed(1),
      trend: Math.random() * 20 - 10, // Mock trend for now
    })) || [];

    return Response.json({ pages });
  } catch (error) {
    console.error('GA4 API Error:', error);
    return Response.json({ error: 'Failed to fetch analytics data' }, { status: 500 });
  }
}
