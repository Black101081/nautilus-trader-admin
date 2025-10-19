/**
 * API Configuration
 * 
 * Centralized configuration for all API endpoints
 */

// Get the Nautilus API base URL from environment or use default
export const NAUTILUS_API_BASE_URL = 
  import.meta.env.VITE_NAUTILUS_API_URL || 
  'https://8000-i1qah0e9c2c9cx0gtysxe-9258e91a.manusvm.computer';

// Main app API (tRPC endpoints)
export const APP_API_BASE_URL = '/api';

/**
 * Nautilus API Endpoints
 */
export const NAUTILUS_API = {
  status: `${NAUTILUS_API_BASE_URL}/api/nautilus/status`,
  strategies: `${NAUTILUS_API_BASE_URL}/api/nautilus/strategies`,
  positions: `${NAUTILUS_API_BASE_URL}/api/nautilus/positions`,
  orders: `${NAUTILUS_API_BASE_URL}/api/nautilus/orders`,
  trades: `${NAUTILUS_API_BASE_URL}/api/nautilus/trades`,
} as const;

/**
 * Helper function to build Nautilus API URL
 */
export function getNautilusApiUrl(endpoint: string): string {
  return `${NAUTILUS_API_BASE_URL}${endpoint}`;
}

