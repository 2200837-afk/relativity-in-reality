import React, { createContext, useContext, useEffect, useRef } from 'react';
import { db } from '../services/databaseService';

interface AnalyticsContextType {
  trackPageView: (pageName: string) => void;
  trackClick: (buttonId: string) => void;
  trackSlider: (sliderId: string, finalValue: number) => void;
  trackARSession: (featureId: string, durationSeconds: number) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null);

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const currentPageRef = useRef<string | null>(null);
  const pageEnterTimeRef = useRef<number>(Date.now());

  // Track page dwell time when switching pages
  const trackPageView = (pageName: string) => {
    const now = Date.now();
    
    // Log dwell time for previous page
    if (currentPageRef.current) {
      const duration = (now - pageEnterTimeRef.current) / 1000;
      db.logEvent({
        eventType: 'DWELL_TIME',
        target: currentPageRef.current,
        value: duration
      });
    }

    // Set new page
    currentPageRef.current = pageName;
    pageEnterTimeRef.current = now;

    db.logEvent({
      eventType: 'PAGE_VIEW',
      target: pageName
    });
  };

  const trackClick = (buttonId: string) => {
    db.logEvent({
      eventType: 'CLICK',
      target: buttonId
    });
  };

  const trackSlider = (sliderId: string, finalValue: number) => {
    db.logEvent({
      eventType: 'SLIDER_CHANGE',
      target: sliderId,
      value: finalValue
    });
  };

  const trackARSession = (featureId: string, durationSeconds: number) => {
     db.logEvent({
         eventType: 'AR_SESSION',
         target: featureId,
         value: durationSeconds
     });
  };

  // Cleanup on unmount (close last page view)
  useEffect(() => {
    return () => {
      if (currentPageRef.current) {
        const duration = (Date.now() - pageEnterTimeRef.current) / 1000;
        db.logEvent({
            eventType: 'DWELL_TIME',
            target: currentPageRef.current,
            value: duration
        });
      }
    };
  }, []);

  return (
    <AnalyticsContext.Provider value={{ trackPageView, trackClick, trackSlider, trackARSession }}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};

// Helper hook for component-level page tracking
export const usePageTracking = (pageName: string) => {
  const { trackPageView } = useAnalytics();
  useEffect(() => {
    trackPageView(pageName);
  }, [pageName]);
};

// Helper hook for AR Duration tracking
export const useARTracking = (featureName: string, isArActive: boolean) => {
    const { trackARSession } = useAnalytics();
    const startTimeRef = useRef<number | null>(null);

    useEffect(() => {
        if (isArActive) {
            startTimeRef.current = Date.now();
        } else {
            if (startTimeRef.current) {
                const duration = (Date.now() - startTimeRef.current) / 1000;
                trackARSession(featureName, duration);
                startTimeRef.current = null;
            }
        }
        
        return () => {
             // Handle component unmount while AR is active
             if (startTimeRef.current) {
                const duration = (Date.now() - startTimeRef.current) / 1000;
                trackARSession(featureName, duration);
             }
        }
    }, [isArActive, featureName]);
}