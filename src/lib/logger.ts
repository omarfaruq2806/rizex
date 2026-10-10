/**
 * Structured Client & Server Logging Utility for Next.js
 * 
 * Provides consistent console output in development and safe error forwarding in production.
 */

type LogLevel = 'info' | 'warn' | 'error';

class AppLogger {
  private isProd = process.env.NODE_ENV === 'production';

  info(message: string, ...optionalParams: any[]) {
    if (!this.isProd) {
      console.log(`[INFO] [${new Date().toLocaleTimeString()}] ${message}`, ...optionalParams);
    }
  }

  warn(message: string, ...optionalParams: any[]) {
    console.warn(`[WARN] [${new Date().toLocaleTimeString()}] ${message}`, ...optionalParams);
  }

  error(message: string, error?: any, context?: Record<string, any>) {
    console.error(`[ERROR] [${new Date().toLocaleTimeString()}] ${message}`, error || '', context || '');

    // Forward to Sentry if available in browser
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      try {
        (window as any).Sentry.captureException(error || new Error(message), {
          extra: context,
        });
      } catch {
        // Silently handle tracking failures
      }
    }
  }
}

export const logger = new AppLogger();
