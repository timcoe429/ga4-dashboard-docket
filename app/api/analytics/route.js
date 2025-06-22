import { BetaAnalyticsDataClient } from '@google-analytics/data';

export async function GET() {
  try {
    const propertyId = process.env.GA4_PROPERTY_ID;
    
    // Log to check if env vars are loaded
    console.log('Property ID:', propertyId);
    console.log('Client Email:', process.env.GOOGLE_CLIENT_EMAIL);
    console.log('Has Private Key:', !!process.env.GOOGLE_PRIVATE_KEY);
    
    if (!propertyId || !process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      return Response.json({ error: 'Missing environment variables' }, { status: 500 });
    }

    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
    });

    // Simple test query
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'date' }],
      metrics: [{ name: 'activeUsers' }],
      limit: 1,
    });

    console.log('GA4 Response:', JSON.stringify(response, null, 2));

    return Response.json({ 
      success: true,
      rowCount: response.rowCount || 0,
      rows: response.rows || [],
      propertyId: propertyId
    });
    
  } catch (error) {
    console.error('GA4 API Error Details:', error);
    return Response.json({ 
      error: error.message,
      code: error.code,
      details: error.details || 'No details'
    }, { status: 500 });
  }
}
