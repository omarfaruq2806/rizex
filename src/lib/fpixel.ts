export const FB_PIXEL_ID =
  process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || '40136314715984380';

declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

/**
 * Fires a standard PageView event.
 */
export const pageview = () => {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', 'PageView');
  }
};

/**
 * Fires a standard Meta Pixel event (e.g. 'Lead', 'ViewContent', 'Contact').
 *
 * @param name Standard Meta event name
 * @param options Event payload (value, currency, content_name, etc.)
 */
export const event = (name: string, options: Record<string, any> = {}) => {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', name, options);
  }
};

/**
 * Fires a custom Meta Pixel event.
 *
 * @param name Custom event name
 * @param options Event payload
 */
export const customEvent = (name: string, options: Record<string, any> = {}) => {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('trackCustom', name, options);
  }
};

