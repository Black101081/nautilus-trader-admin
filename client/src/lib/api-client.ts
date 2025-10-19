/**
 * Centralized API Client for tRPC endpoints
 * 
 * This client provides a consistent way to call tRPC endpoints using direct fetch API.
 * We use direct fetch instead of tRPC hooks because tRPC React Query hooks have
 * stability issues with batching and data format.
 * 
 * Usage:
 * ```typescript
 * import { apiClient } from "@/lib/api-client";
 * 
 * const data = await apiClient.query<SystemStatus>('nautilusCore.getSystemStatus');
 * const result = await apiClient.mutate('nautilusCore.restartComponent', { componentId: 'cache' });
 * ```
 */

export interface TRPCResponse<T> {
  result?: {
    data?: {
      json?: T;
    };
  };
  error?: {
    json?: {
      message: string;
      code: number;
      data?: any;
    };
  };
}

export class APIClient {
  private baseURL = '/api/trpc';

  /**
   * Query a tRPC endpoint (GET request)
   * @param endpoint - The tRPC endpoint path (e.g., 'nautilusCore.getSystemStatus')
   * @returns The parsed JSON response data
   */
  async query<T>(endpoint: string): Promise<T | null> {
    try {
      const response = await fetch(`${this.baseURL}/${endpoint}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result: TRPCResponse<T> = await response.json();

      if (result.error) {
        throw new Error(result.error.json?.message || 'API Error');
      }

      return result.result?.data?.json ?? null;
    } catch (error: any) {
      console.error(`[APIClient] Query ${endpoint} failed:`, error);
      throw error;
    }
  }

  /**
   * Mutate a tRPC endpoint (POST request)
   * @param endpoint - The tRPC endpoint path (e.g., 'nautilusCore.restartComponent')
   * @param input - The input data for the mutation
   * @returns The parsed JSON response data
   */
  async mutate<T, I = any>(endpoint: string, input?: I): Promise<T | null> {
    try {
      const response = await fetch(`${this.baseURL}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(input || {}),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result: TRPCResponse<T> = await response.json();

      if (result.error) {
        throw new Error(result.error.json?.message || 'API Error');
      }

      return result.result?.data?.json ?? null;
    } catch (error: any) {
      console.error(`[APIClient] Mutate ${endpoint} failed:`, error);
      throw error;
    }
  }

  /**
   * Query multiple endpoints in parallel
   * @param endpoints - Array of tRPC endpoint paths
   * @returns Array of parsed JSON responses
   */
  async queryMany<T extends any[]>(
    ...endpoints: string[]
  ): Promise<{ [K in keyof T]: T[K] | null }> {
    try {
      const promises = endpoints.map(endpoint => this.query(endpoint));
      const results = await Promise.all(promises);
      return results as any;
    } catch (error: any) {
      console.error('[APIClient] QueryMany failed:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const apiClient = new APIClient();

/**
 * React hook for fetching data with loading and error states
 * 
 * Usage:
 * ```typescript
 * const { data, isLoading, error, refetch } = useAPIQuery<SystemStatus>(
 *   'nautilusCore.getSystemStatus'
 * );
 * ```
 */
export function useAPIQuery<T>(
  endpoint: string,
  options?: {
    refetchInterval?: number;
    enabled?: boolean;
  }
) {
  const [data, setData] = React.useState<T | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchData = React.useCallback(async () => {
    if (options?.enabled === false) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await apiClient.query<T>(endpoint);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, options?.enabled]);

  React.useEffect(() => {
    fetchData();

    if (options?.refetchInterval) {
      const interval = setInterval(fetchData, options.refetchInterval);
      return () => clearInterval(interval);
    }
  }, [fetchData, options?.refetchInterval]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  };
}

// Re-export React for the hook
import React from 'react';

