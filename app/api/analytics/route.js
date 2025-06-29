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

    // Helper function to normalize page paths for grouping
    function normalizePage(pagePath) {
      // Normalize home page variations
      if (!pagePath || pagePath === '/' || pagePath === '' || pagePath === '/index' || pagePath === '/home') {
        return '/';
      }
      
      // Remove trailing slashes and query parameters for grouping
      let normalized = pagePath.split('?')[0]; // Remove query params
      normalized = normalized.replace(/\/$/, '') || '/'; // Remove trailing slash, but keep '/' for root
      
      return normalized;
    }

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

    // Process pages data and group similar pages
    const pageGroups = {};
    pagesResponse.rows?.forEach(row => {
      const pagePath = row.dimensionValues[0].value;
      const pageTitle = row.dimensionValues[1]?.value || '';
      const pageViews = parseInt(row.metricValues[0].value) || 0;
      const normalizedPath = normalizePage(pagePath);
      
      if (!pageGroups[normalizedPath]) {
        pageGroups[normalizedPath] = {
          page: normalizedPath,
          title: extractTitle(normalizedPath, pageTitle),
          sessions: 0,
          conversions: 0,
          originalPaths: []
        };
      }
      
      pageGroups[normalizedPath].sessions += pageViews;
      pageGroups[normalizedPath].originalPaths.push(pagePath);
    });

    // Add conversions to grouped pages
    Object.keys(conversionsByPage).forEach(pagePath => {
      const normalizedPath = normalizePage(pagePath);
      if (pageGroups[normalizedPath]) {
        pageGroups[normalizedPath].conversions += conversionsByPage[pagePath];
      }
    });

    // Convert to array and calculate rates/trends
    const allPages = Object.values(pageGroups).map(group => ({
      ...group,
      rate: group.sessions > 0 ? parseFloat(((group.conversions / group.sessions) * 100).toFixed(1)) : 0,
      trend: parseFloat((Math.random() * 20 - 10).toFixed(1)) // Random trend for now, replace with actual comparison data
    })).sort((a, b) => b.sessions - a.sessions);

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

    // Get comprehensive funnel data - actual pages and conversions
    const [funnelPagesResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: dateRange, endDate: 'today' }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'screenPageViews' }],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 100
    });

    // Get conversions by page for funnel analysis
    const [funnelConversionsResponse] = await analyticsDataClient.runReport({
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
      orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
      limit: 50
    });

    // Process all page data for funnel analysis
    const allPageData = {};
    funnelPagesResponse.rows?.forEach(row => {
      const path = normalizePage(row.dimensionValues[0].value);
      const views = parseInt(row.metricValues[0].value) || 0;
      
      if (!allPageData[path]) {
        allPageData[path] = { views: 0, conversions: 0 };
      }
      allPageData[path].views += views;
    });

    // Add conversion data
    funnelConversionsResponse.rows?.forEach(row => {
      const path = normalizePage(row.dimensionValues[0].value);
      const conversions = parseInt(row.metricValues[0].value) || 0;
      
      if (!allPageData[path]) {
        allPageData[path] = { views: 0, conversions: 0 };
      }
      allPageData[path].conversions += conversions;
    });

    // Define your actual funnels based on real paths
    const realFunnels = {
      homeToDemo: {
        name: 'Home → Pricing → Demo',
        steps: [
          { name: 'Home Page', path: '/' },
          { name: 'Pricing Page', path: '/pricing' },  // We'll find the actual pricing page
          { name: 'Demo Conversion', path: '/', isConversion: true }
        ]
      },
      dumpsterSoftware: {
        name: 'Dumpster Software → Demo',
        steps: [
          { name: 'Dumpster Software', path: '/dumpster-rental-software' },
          { name: 'Demo Conversion', path: '/dumpster-rental-software', isConversion: true }
        ]
      },
      junkSoftware: {
        name: 'Junk Software → Demo',
        steps: [
          { name: 'Junk Software', path: '/junk-removal-software' },
          { name: 'Demo Conversion', path: '/junk-removal-software', isConversion: true }
        ]
      }
    };

    // Find actual pricing page from your data
    const pricingPages = Object.keys(allPageData).filter(path => 
      path.includes('pricing') || path.includes('plans') || path.includes('cost')
    );
    
    if (pricingPages.length > 0) {
      realFunnels.homeToDemo.steps[1].path = pricingPages[0];
    }

    // Build funnel data with real numbers
    const processedFunnels = {};
    
    Object.keys(realFunnels).forEach(funnelKey => {
      const funnel = realFunnels[funnelKey];
      const processedSteps = [];
      
      funnel.steps.forEach((step, index) => {
        const pageData = allPageData[step.path] || { views: 0, conversions: 0 };
        
        if (step.isConversion) {
          // For conversion steps, use conversion count
          processedSteps.push({
            step: step.name,
            users: pageData.conversions,
            rate: processedSteps.length > 0 && processedSteps[0].users > 0 ? 
              parseFloat(((pageData.conversions / processedSteps[0].users) * 100).toFixed(1)) : 0
          });
        } else {
          // For view steps, use page views
          processedSteps.push({
            step: step.name,
            users: pageData.views,
            rate: index === 0 ? 100 : (processedSteps.length > 0 && processedSteps[0].users > 0 ? 
              parseFloat(((pageData.views / processedSteps[0].users) * 100).toFixed(1)) : 0)
          });
        }
      });
      
      processedFunnels[funnelKey] = {
        name: funnel.name,
        steps: processedSteps
      };
    });

    return Response.json({ 
      pages: allPages.slice(0, 10),
      blogPosts: blogPosts.length > 0 ? blogPosts : [],
      totalConversions: totalConversions,
      totalSessions: totalSessions,
      topPageViews: allPages[0]?.sessions || 0,
      topPagePath: allPages[0]?.page || 'No data',
      funnelData: processedFunnels,
      // Debug info to help troubleshoot
      debugInfo: {
        totalPagesFound: Object.keys(allPageData).length,
        topPages: Object.keys(allPageData).slice(0, 10),
        conversionsFound: Object.values(allPageData).reduce((sum, page) => sum + page.conversions, 0),
        pricingPagesFound: pricingPages
      }
    });
    
  } catch (error) {
    console.error('GA4 API Error:', error);
    return Response.json({ 
      error: error.message,
      code: error.code
    }, { status: 500 });
  }
}
