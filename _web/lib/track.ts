type W = Window & { gtag?: (...a: unknown[]) => void; fbq?: (...a: unknown[]) => void };

export function track(event: string, params: Record<string, unknown> = {}) {
  const w = window as W;
  try { w.gtag?.('event', event, params); } catch {}
}

export function trackLead(source: string, email: string) {
  const w = window as W;
  try {
    w.gtag?.('event', 'generate_lead', { event_category: 'form', event_label: source });
    w.gtag?.('set', 'user_data', { email });
    w.gtag?.('event', 'conversion', { send_to: 'AW-16938222773/b5qqCOf5hK0cELWJ44w_' });
    w.fbq?.('track', 'Lead', { content_name: source });
  } catch {}
}
