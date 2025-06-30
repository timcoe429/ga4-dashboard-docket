'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function AnalyticsTracker({ property = 'docket' }) {
  const pathname = usePathname();

  // Generate or get user ID
  const getUserId = () => {
    let userId = localStorage.getItem('analytics_user_id');
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
      localStorage.setItem('analytics_user_id', userId);
    }
    return userId;
  };

  // Generate session ID
  const getSessionId = () => {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  };

  // Track session start
  const trackSession = async () => {
    try {
      const sessionId = getSessionId();
      const userId = getUserId();
      
      await fetch('/api/track/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          userId,
          property,
          source: document.referrer ? new URL(document.referrer).hostname : 'direct',
          medium: document.referrer ? 'referral' : 'direct',
          referrer: document.referrer || null,
          userAgent: navigator.userAgent,
        })
      });
    } catch (error) {
      console.error('Session tracking error:', error);
    }
  };

  // Track page view
  const trackPageView = async (page) => {
    try {
      const sessionId = getSessionId();
      
      await fetch('/api/track/pageview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          page,
          title: document.title,
        })
      });
    } catch (error) {
      console.error('Page view tracking error:', error);
    }
  };

  // Track conversion
  const trackConversion = async (conversionType, conversionPage, formData = null, value = null) => {
    try {
      const sessionId = getSessionId();
      
      await fetch('/api/track/conversion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          conversionType,
          conversionPage,
          formData,
          value
        })
      });
    } catch (error) {
      console.error('Conversion tracking error:', error);
    }
  };

  // Set up page tracking
  useEffect(() => {
    // Track session on first load
    trackSession();
    
    // Track initial page view
    trackPageView(pathname);
  }, []);

  // Track page changes
  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);

  // Set up conversion tracking listeners
  useEffect(() => {
    // Track form submissions
    const handleFormSubmit = (e) => {
      const form = e.target;
      if (form.tagName === 'FORM') {
        // Determine conversion type based on form
        let conversionType = 'form_submission';
        if (form.id?.includes('demo') || form.action?.includes('demo')) {
          conversionType = 'demo_request';
        } else if (form.id?.includes('contact') || form.action?.includes('contact')) {
          conversionType = 'contact_form';
        }
        
        // Collect form data
        const formData = new FormData(form);
        const formObject = Object.fromEntries(formData.entries());
        
        trackConversion(conversionType, pathname, formObject);
      }
    };

    // Track button clicks that might be conversions
    const handleButtonClick = (e) => {
      const button = e.target.closest('button, a');
      if (button) {
        const text = button.textContent.toLowerCase();
        const href = button.href;
        
        if (text.includes('demo') || text.includes('schedule') || href?.includes('demo')) {
          trackConversion('demo_request', pathname);
        } else if (text.includes('contact') || text.includes('get started') || href?.includes('contact')) {
          trackConversion('contact_form', pathname);
        } else if (text.includes('signup') || text.includes('sign up') || text.includes('register')) {
          trackConversion('signup', pathname);
        }
      }
    };

    document.addEventListener('submit', handleFormSubmit);
    document.addEventListener('click', handleButtonClick);

    return () => {
      document.removeEventListener('submit', handleFormSubmit);
      document.removeEventListener('click', handleButtonClick);
    };
  }, [pathname]);

  // Expose trackConversion to window for manual tracking
  useEffect(() => {
    window.trackConversion = trackConversion;
  }, []);

  return null; // This component doesn't render anything
}

// Manual tracking function for custom conversions
export const trackManualConversion = (conversionType, value = null, formData = null) => {
  if (typeof window !== 'undefined' && window.trackConversion) {
    window.trackConversion(conversionType, window.location.pathname, formData, value);
  }
}; 