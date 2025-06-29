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

    // Get page data with filters to exclude customer login traffic
    const [pagesResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: dateRange, endDate: 'today' }],
      dimensions: [{ name: 'pagePath' }, { name: 'pageTitle' }],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'activeUsers' }
      ],
      dimensionFilter: {
        andGroup: {
          expressions: [
            {
              notExpression: {
                filter: {
                  fieldName: 'pagePath',
                  stringFilter: {
                    value: '/__/auth',
                    matchType: 'CONTAINS'
                  }
                }
              }
            },
            {
              notExpression: {
                filter: {
                  fieldName: 'pagePath',
                  stringFilter: {
                    value: '/auth/',
                    matchType: 'CONTAINS'
                  }
                }
              }
            },
            {
              notExpression: {
                filter: {
                  fieldName: 'pagePath',
                  stringFilter: {
                    value: 'iframe',
                    matchType: 'CONTAINS'
                  }
                }
              }
            },
            {
              notExpression: {
                filter: {
                  fieldName: 'hostName',
                  stringFilter: {
                    value: 'app.yourdocket.com',
                    matchType: 'EXACT'
                  }
                }
              }
            }
          ]
        }
      },
      limit: 50,
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }]
    });

    // Get conversion events with same filters
    const [conversionsResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: dateRange, endDate: 'today' }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'eventCount' }],
      dimensionFilter: {
        andGroup: {
          expressions: [
            {
              filter: {
                fieldName: 'eventName',
                stringFilter: {
                  value: 'generate_lead_docket',
                  matchType: 'EXACT'
                }
              }
            },
            {
              notExpression: {
                filter: {
                  fieldName: 'pagePath',
                  stringFilter: {
                    value: '/__/auth',
                    matchType: 'CONTAINS'
                  }
                }
              }
            },
            {
              notExpression: {
                filter: {
                  fieldName: 'pagePath',
                  stringFilter: {
                    value: '/auth/',
                    matchType: 'CONTAINS'
                  }
                }
              }
            },
            {
              notExpression: {
                filter: {
                  fieldName: 'pagePath',
                  stringFilter: {
                    value: 'iframe',
                    matchType: 'CONTAINS'
                  }
                }
              }
            },
            {
              notExpression: {
                filter: {
                  fieldName: 'hostName',
                  stringFilter: {
                    value: 'app.yourdocket.com',
                    matchType: 'EXACT'
                  }
                }
              }
            }
          ]
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

    // Helper function to extract readable titles from URLs
    function extractTitle(pagePath, pageTitle) {
      // Use GA pageTitle if available and meaningful
      if (pageTitle && pageTitle !== '(not set)' && !pageTitle.includes('N/A')) {
        return pageTitle;
      }
      
      // Extract title from URL path
      if (pagePath === '/' || pagePath === '') return 'Home Page';
      
      // Remove leading slash and split by slash
      const pathParts = pagePath.replace(/^\/+/, '').split('/');
      const lastPart = pathParts[pathParts.length - 1];
      
      // Convert URL slug to readable title
      return lastPart
        .replace(/-/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase())
        .trim() || 'Untitled Page';
    }

    // Process pages data
    const allPages = pagesResponse.rows?.map(row => {
      const pagePath = row.dimensionValues[0].value;
      const pageTitle = row.dimensionValues[1]?.value || '';
      const pageViews = parseInt(row.metricValues[0].value) || 0;
      const conversions = conversionsByPage[pagePath] || 0;
      
      return {
        page: pagePath,
        title: extractTitle(pagePath, pageTitle),
        sessions: pageViews,
        conversions: conversions,
        rate: pageViews > 0 ? parseFloat(((conversions / pageViews) * 100).toFixed(1)) : 0,
        trend: parseFloat((Math.random() * 20 - 10).toFixed(1)) // Random trend for now, replace with actual comparison data
      };
    }) || [];

    // Get blog posts with better filtering
    const blogPosts = allPages
      .filter(page => 
        page.page.includes('/blog') || 
        page.page.includes('/post') || 
        page.page.includes('/article') ||
        page.page.includes('/how-') ||
        page.page.includes('/guide') ||
        page.page.includes('/tips')
      )
      .slice(0, 4)
      .map(post => ({
        ...post,
        views: post.sessions,
        title: post.title
      }));

    // Calculate totals (now properly filtered)
    const totalSessions = allPages.reduce((sum, page) => sum + page.sessions, 0);
    const totalConversions = Object.values(conversionsByPage).reduce((sum, val) => sum + val, 0);

    // Get funnel data
    const [homeToDemo] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: dateRange, endDate: 'today' }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'screenPageViews' }],
      dimensionFilter: {
        orGroup: {
          expressions: [
            { filter: { fieldName: 'pagePath', stringFilter: { value: '/', matchType: 'EXACT' } } },
            { filter: { fieldName: 'pagePath', stringFilter: { value: '/pricing', matchType: 'EXACT' } } },
            { filter: { fieldName: 'pagePath', stringFilter: { value: '/dumpster-rental-software/', matchType: 'EXACT' } } },
            { filter: { fieldName: 'pagePath', stringFilter: { value: '/junk-removal-software/', matchType: 'EXACT' } } }
          ]
        }
      }
    });

    // Process funnel data
    const funnelData = {};
    homeToDemo.rows?.forEach(row => {
      const path = row.dimensionValues[0].value;
      const views = parseInt(row.metricValues[0].value) || 0;
      funnelData[path] = views;
    });

    return Response.json({ 
      pages: allPages.slice(0, 10),
      blogPosts: blogPosts.length > 0 ? blogPosts : [],
      totalConversions: totalConversions,
      totalSessions: totalSessions,
      topPageViews: allPages[0]?.sessions || 0,
      topPagePath: allPages[0]?.page || 'No data',
      funnelData: funnelData
    });
    
  } catch (error) {
    console.error('GA4 API Error:', error);
    return Response.json({ 
      error: error.message,
      code: error.code
    }, { status: 500 });
  }
}
