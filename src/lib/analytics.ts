export interface TrackingPayload {
  eventType: 'PAGE_VIEW' | 'REGISTRATION_STARTED' | 'REGISTRATION_COMPLETED' | 'PARTNERSHIP_ENQUIRY' | 'HOST_ENQUIRY' | 'QR_SCAN';
  pageUrl?: string;
  eventSlug?: string;
  source?: string;
  campaign?: string;
  medium?: string;
  qrCode?: string;
  schoolName?: string;
  city?: string;
  metadata?: Record<string, any>;
}

export async function logAnalyticsEvent(payload: TrackingPayload) {
  try {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const enrichedPayload: TrackingPayload = {
        ...payload,
        source: payload.source || urlParams.get('utm_source') || urlParams.get('ref') || undefined,
        campaign: payload.campaign || urlParams.get('utm_campaign') || undefined,
        medium: payload.medium || urlParams.get('utm_medium') || undefined,
        qrCode: payload.qrCode || urlParams.get('qr') || undefined,
        pageUrl: payload.pageUrl || window.location.pathname,
      };

      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enrichedPayload),
      });
    }
  } catch (error) {
    // Fail silently in client, avoid blocking user experience
    console.debug('[Analytics] Tracking event non-fatal error:', error);
  }
}
