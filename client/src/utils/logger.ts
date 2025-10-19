/**
 * Development Logging Utility
 * Automatically disabled in production mode
 */

const isDevelopment = import.meta.env.MODE === 'development' || import.meta.env.DEV;

export const logger = {
  /**
   * Log general information (only in development)
   */
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log('[DEV]', ...args);
    }
  },

  /**
   * Log info information (only in development)
   */
  info: (context: string, ...args: any[]) => {
    if (isDevelopment) {
      console.info(`[INFO:${context}]`, ...args);
    }
  },

  /**
   * Log debug information (only in development)
   */
  debug: (context: string, ...args: any[]) => {
    if (isDevelopment) {
      console.log(`[DEBUG:${context}]`, ...args);
    }
  },

  /**
   * Log errors (always enabled)
   */
  error: (context: string, ...args: any[]) => {
    console.error(`[ERROR:${context}]`, ...args);
  },

  /**
   * Log warnings (always enabled)
   */
  warn: (context: string, ...args: any[]) => {
    console.warn(`[WARN:${context}]`, ...args);
  },

  /**
   * Log component lifecycle (only in development)
   */
  component: (name: string, event: string, data?: any) => {
    if (isDevelopment) {
      console.log(`[COMPONENT:${name}]`, event, data || '');
    }
  },

  /**
   * Log component render (only in development)
   */
  render: (name: string, message: string, data?: any) => {
    if (isDevelopment) {
      console.log(`[RENDER:${name}]`, message, data || '');
    }
  },

  /**
   * Log API calls (only in development)
   */
  api: (method: string, endpoint: string, data?: any) => {
    if (isDevelopment) {
      console.log(`[API:${method}]`, endpoint, data || '');
    }
  },

  /**
   * Log user interactions (only in development)
   */
  interaction: (element: string, action: string, data?: any) => {
    if (isDevelopment) {
      console.log(`[INTERACTION:${element}]`, action, data || '');
    }
  },

  /**
   * Log service operations (only in development)
   */
  service: (serviceName: string, operation: string, data?: any) => {
    if (isDevelopment) {
      console.log(`[SERVICE:${serviceName}]`, operation, data || '');
    }
  },

  /**
   * Group logs together (only in development)
   */
  group: (label: string, callback: () => void) => {
    if (isDevelopment) {
      console.group(`[GROUP] ${label}`);
      callback();
      console.groupEnd();
    } else {
      callback();
    }
  },

  /**
   * Log performance timing (only in development)
   */
  time: (label: string) => {
    if (isDevelopment) {
      console.time(`[TIME] ${label}`);
    }
  },

  timeEnd: (label: string) => {
    if (isDevelopment) {
      console.timeEnd(`[TIME] ${label}`);
    }
  },

  /**
   * Check if development mode
   */
  isDev: () => isDevelopment,
};

export default logger;

