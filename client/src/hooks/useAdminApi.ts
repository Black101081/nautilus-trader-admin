import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { trpc } from '@/lib/trpc';

/**
 * Custom hooks for Admin Dashboard API integration
 * Connects to backend tRPC APIs
 */

// ============================================================================
// System & Components
// ============================================================================

/**
 * Get system status
 */
export function useSystemStatus() {
  return useQuery({
    queryKey: ['system', 'status'],
    queryFn: async () => {
      const result = await trpc.nautilusCore.getSystemStatus.query();
      return result;
    },
    refetchInterval: 5000, // Refresh every 5 seconds
  });
}

/**
 * Get all Nautilus components
 */
export function useComponents() {
  return useQuery({
    queryKey: ['components', 'all'],
    queryFn: async () => {
      const result = await trpc.nautilusCore.getAllComponents.query();
      return result;
    },
    refetchInterval: 10000, // Refresh every 10 seconds
  });
}

/**
 * Get specific component status
 */
export function useComponentStatus(componentName: string) {
  return useQuery({
    queryKey: ['component', 'status', componentName],
    queryFn: async () => {
      const result = await trpc.nautilusCore.getComponentStatus.query({ component: componentName });
      return result;
    },
    enabled: !!componentName,
    refetchInterval: 5000,
  });
}

// ============================================================================
// Metrics
// ============================================================================

/**
 * Get system metrics (CPU, memory, etc.)
 */
export function useSystemMetrics() {
  return useQuery({
    queryKey: ['metrics', 'system'],
    queryFn: async () => {
      const result = await trpc.nautilusCore.getSystemMetrics.query();
      return result;
    },
    refetchInterval: 3000, // Refresh every 3 seconds for real-time feel
  });
}

/**
 * Get trading metrics
 */
export function useTradingMetrics() {
  return useQuery({
    queryKey: ['metrics', 'trading'],
    queryFn: async () => {
      const result = await trpc.nautilusCore.getTradingMetrics.query();
      return result;
    },
    refetchInterval: 5000,
  });
}

// ============================================================================
// Logs
// ============================================================================

/**
 * Get system logs
 */
export function useSystemLogs(options?: {
  component?: string;
  level?: string;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['logs', 'system', options],
    queryFn: async () => {
      const result = await trpc.nautilusCore.getLogs.query({
        component: options?.component,
        level: options?.level || 'INFO',
        limit: options?.limit || 100,
      });
      return result;
    },
    refetchInterval: 5000, // Refresh every 5 seconds
  });
}

/**
 * Get admin logs from database
 */
export function useAdminLogs() {
  return useQuery({
    queryKey: ['logs', 'admin'],
    queryFn: async () => {
      const result = await trpc.admin.systemLogs.query();
      return result;
    },
    refetchInterval: 10000,
  });
}

// ============================================================================
// Database & Stats
// ============================================================================

/**
 * Get database statistics
 */
export function useDatabaseStats() {
  return useQuery({
    queryKey: ['database', 'stats'],
    queryFn: async () => {
      const result = await trpc.admin.getDatabaseStats.query();
      return result;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

/**
 * Get system statistics
 */
export function useSystemStats() {
  return useQuery({
    queryKey: ['system', 'stats'],
    queryFn: async () => {
      const result = await trpc.admin.systemStats.query();
      return result;
    },
    refetchInterval: 15000,
  });
}

// ============================================================================
// Users
// ============================================================================

/**
 * Get all users
 */
export function useUsers() {
  return useQuery({
    queryKey: ['users', 'all'],
    queryFn: async () => {
      const result = await trpc.admin.allUsers.query();
      return result;
    },
    refetchInterval: 30000,
  });
}

// ============================================================================
// Audit Trail
// ============================================================================

/**
 * Get audit trail
 */
export function useAuditTrail() {
  return useQuery({
    queryKey: ['audit', 'trail'],
    queryFn: async () => {
      const result = await trpc.admin.auditTrail.query();
      return result;
    },
    refetchInterval: 15000,
  });
}

// ============================================================================
// Helper Hooks
// ============================================================================

/**
 * Invalidate all admin queries (for manual refresh)
 */
export function useInvalidateAdmin() {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({ queryKey: ['system'] });
    queryClient.invalidateQueries({ queryKey: ['components'] });
    queryClient.invalidateQueries({ queryKey: ['metrics'] });
    queryClient.invalidateQueries({ queryKey: ['logs'] });
    queryClient.invalidateQueries({ queryKey: ['database'] });
    queryClient.invalidateQueries({ queryKey: ['users'] });
    queryClient.invalidateQueries({ queryKey: ['audit'] });
  };
}

/**
 * Check if any admin query is loading
 */
export function useIsAdminLoading() {
  const systemStatus = useSystemStatus();
  const components = useComponents();
  const systemMetrics = useSystemMetrics();
  
  return systemStatus.isLoading || components.isLoading || systemMetrics.isLoading;
}

/**
 * Check if any admin query has error
 */
export function useAdminError() {
  const systemStatus = useSystemStatus();
  const components = useComponents();
  const systemMetrics = useSystemMetrics();
  
  return systemStatus.error || components.error || systemMetrics.error;
}

