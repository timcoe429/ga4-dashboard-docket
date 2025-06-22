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

    // Test with a broader query
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'screenPageViews' }],
      limit: 10,
    });

    // Return detailed response for debugging
    return Response.json({ 
      success: true,
      rowCount: response.rowCount || 0,
      rows: response.rows || [],
      propertyId: propertyId,
      pages: response.rows?.map(row => ({
        page: row.dimensionValues[0].value,
        sessions: parseInt(row.metricValues[0].value) || 0,
        conversions: 0,
        rate: 0,
        trend: 0
      })) || []
    });
    
  } catch (error) {
    console.error('GA4 API Error:', error);
    return Response.json({ 
      error: error.message,
      code: error.code
    }, { status: 500 });
  }
}
