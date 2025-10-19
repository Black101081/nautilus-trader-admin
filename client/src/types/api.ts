/**
 * Centralized TypeScript type definitions for API responses
 * 
 * This file contains all type definitions for tRPC API responses to ensure
 * type safety and consistency across the application.
 */

// ============================================================================
// Nautilus Core Types
// ============================================================================

export interface SystemStatus {
  status: string;
  version: string;
  uptime_seconds: number;
  uptime_formatted: string;
  timestamp: string;
  nautilus_available: boolean;
}

export interface Component {
  id?: string;
  name: string;
  type?: string;
  state?: string;
  status?: string;
  health: string;
  description: string;
  uptime?: number;
  memory?: string;
  cpu?: string;
  metrics?: Record<string, any>;
}

export interface Feature {
  id?: string;
  name: string;
  category: string;
  enabled: boolean;
  description: string;
  status?: string;
  requires_config?: boolean;
  requires_data?: boolean;
}

export interface Service {
  id?: string;
  name: string;
  category: string;
  status: string;
  description: string;
  health?: string;
  uptime?: number;
}

export interface SystemMetrics {
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  network_in: number;
  network_out: number;
  uptime: string;
}

export interface TradingMetrics {
  total_orders: number;
  filled_orders: number;
  cancelled_orders: number;
  rejected_orders: number;
  total_trades: number;
  total_volume: number;
  pnl: number;
  win_rate: number;
}

export interface ComponentHealthSummary {
  healthy: number;
  degraded: number;
  unhealthy: number;
  total: number;
}

export interface FeatureStatusSummary {
  available: number;
  configured: number;
  requires_config: number;
  requires_data: number;
  total: number;
}

// ============================================================================
// Admin Types
// ============================================================================

export interface User {
  id: number;
  username: string;
  email?: string;
  role: string;
  created_at: string;
  last_login?: string;
  is_active: boolean;
}

export interface SystemStats {
  totalUsers: number;
  totalStrategies: number;
  totalBacktests: number;
  systemLogsCount: number;
  auditTrailCount: number;
  activeConnections: number;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
}

export interface SystemLog {
  id: number;
  timestamp: string;
  level: string;
  message: string;
  source?: string;
  details?: any;
}

export interface AuditLog {
  id: number;
  timestamp: string;
  user_id: number;
  username: string;
  action: string;
  resource: string;
  details?: any;
  ip_address?: string;
}

export interface DatabaseStats {
  postgres?: {
    size: string;
    tables: number;
    connections: number;
    version: string;
  };
  redis?: {
    memory_used: string;
    keys: number;
    uptime: string;
    version: string;
  };
  parquet?: {
    total_size: string;
    file_count: number;
    directories: number;
  };
}

// ============================================================================
// Strategy Types
// ============================================================================

export interface Strategy {
  id: number;
  name: string;
  description?: string;
  status: string;
  created_at: string;
  updated_at: string;
  user_id: number;
  config?: any;
  performance?: {
    total_trades: number;
    win_rate: number;
    pnl: number;
    sharpe_ratio: number;
  };
}

export interface Backtest {
  id: number;
  strategy_id: number;
  name: string;
  status: string;
  start_date: string;
  end_date: string;
  created_at: string;
  completed_at?: string;
  results?: {
    total_trades: number;
    win_rate: number;
    pnl: number;
    sharpe_ratio: number;
    max_drawdown: number;
  };
}

// ============================================================================
// Trading Types
// ============================================================================

export interface Order {
  id: string;
  strategy_id: number;
  symbol: string;
  side: 'BUY' | 'SELL';
  type: 'MARKET' | 'LIMIT' | 'STOP' | 'STOP_LIMIT';
  quantity: number;
  price?: number;
  status: string;
  created_at: string;
  filled_at?: string;
  filled_quantity?: number;
  filled_price?: number;
}

export interface Position {
  id: string;
  strategy_id: number;
  symbol: string;
  side: 'LONG' | 'SHORT';
  quantity: number;
  entry_price: number;
  current_price: number;
  unrealized_pnl: number;
  realized_pnl: number;
  opened_at: string;
}

export interface Trade {
  id: string;
  order_id: string;
  strategy_id: number;
  symbol: string;
  side: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  commission: number;
  timestamp: string;
}

// ============================================================================
// Risk Types
// ============================================================================

export interface RiskMetrics {
  total_exposure: number;
  max_position_size: number;
  current_drawdown: number;
  max_drawdown: number;
  var_95: number;
  sharpe_ratio: number;
  sortino_ratio: number;
}

export interface RiskLimit {
  id: number;
  name: string;
  type: string;
  value: number;
  current_value: number;
  status: 'OK' | 'WARNING' | 'BREACH';
}

// ============================================================================
// Utility Types
// ============================================================================

export interface APIError {
  message: string;
  code: number;
  data?: any;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

