/**
 * Nautilus Trader API Client
 * Provides typed client for Nautilus FastAPI bridge
 */

// Use public Nautilus API URL
const NAUTILUS_API_BASE_URL = import.meta.env.VITE_NAUTILUS_API_URL || 'https://8000-i1qah0e9c2c9cx0gtysxe-9258e91a.manusvm.computer';

// ============================================================================
// Types
// ============================================================================

export interface SystemStatus {
  status: string;
  uptime: number;
  trader_id: string;
  instance_id: string;
  strategies_count: number;
  orders_count: number;
  positions_count: number;
  timestamp: string;
}

export interface StrategyInfo {
  id: string;
  name: string;
  status: string;
  orders_count: number;
  positions_count: number;
  pnl: number;
  created_at: string;
}

export interface OrderInfo {
  id: string;
  strategy_id: string;
  instrument_id: string;
  side: string;
  type: string;
  quantity: number;
  price: number | null;
  status: string;
  filled_qty: number;
  avg_px: number | null;
  created_at: string;
  updated_at: string;
}

export interface PositionInfo {
  id: string;
  instrument_id: string;
  side: string;
  quantity: number;
  avg_px: number;
  unrealized_pnl: number;
  realized_pnl: number;
  opened_at: string;
}

export interface TradeInfo {
  id: string;
  order_id: string;
  instrument_id: string;
  side: string;
  quantity: number;
  price: number;
  commission: number;
  timestamp: string;
}

export interface CreateOrderRequest {
  strategy_id: string;
  instrument_id: string;
  side: "BUY" | "SELL";
  order_type: "MARKET" | "LIMIT" | "STOP";
  quantity: number;
  price?: number;
  time_in_force?: "GTC" | "IOC" | "FOK" | "DAY";
}

export interface DeployStrategyRequest {
  strategy_name: string;
  config: Record<string, any>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// ============================================================================
// API Client Class
// ============================================================================

class NautilusApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = NAUTILUS_API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Generic fetch wrapper with error handling
   */
  private async fetch<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      throw error;
    }
  }

  // ==========================================================================
  // System Endpoints
  // ==========================================================================

  /**
   * Get system status
   */
  async getSystemStatus(): Promise<SystemStatus> {
    return this.fetch<SystemStatus>('/api/nautilus/status');
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.fetch('/health');
  }

  // ==========================================================================
  // Strategy Endpoints
  // ==========================================================================

  /**
   * Get all strategies
   */
  async getStrategies(): Promise<StrategyInfo[]> {
    return this.fetch<StrategyInfo[]>('/api/nautilus/strategies');
  }

  /**
   * Get strategy by ID
   */
  async getStrategy(strategyId: string): Promise<StrategyInfo> {
    const strategies = await this.getStrategies();
    const strategy = strategies.find(s => s.id === strategyId);
    if (!strategy) {
      throw new Error(`Strategy ${strategyId} not found`);
    }
    return strategy;
  }

  /**
   * Deploy a new strategy
   */
  async deployStrategy(request: DeployStrategyRequest): Promise<ApiResponse> {
    return this.fetch<ApiResponse>('/api/nautilus/strategies/deploy', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Start a strategy
   */
  async startStrategy(strategyId: string): Promise<ApiResponse> {
    return this.fetch<ApiResponse>(`/api/nautilus/strategies/${strategyId}/start`, {
      method: 'POST',
    });
  }

  /**
   * Stop a strategy
   */
  async stopStrategy(strategyId: string): Promise<ApiResponse> {
    return this.fetch<ApiResponse>(`/api/nautilus/strategies/${strategyId}/stop`, {
      method: 'POST',
    });
  }

  // ==========================================================================
  // Order Endpoints
  // ==========================================================================

  /**
   * Get all orders, optionally filtered by strategy
   */
  async getOrders(strategyId?: string): Promise<OrderInfo[]> {
    const params = strategyId ? `?strategy_id=${strategyId}` : '';
    return this.fetch<OrderInfo[]>(`/api/nautilus/orders${params}`);
  }

  /**
   * Create a new order
   */
  async createOrder(request: CreateOrderRequest): Promise<ApiResponse> {
    return this.fetch<ApiResponse>('/api/nautilus/orders', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Cancel an order
   */
  async cancelOrder(orderId: string): Promise<ApiResponse> {
    return this.fetch<ApiResponse>(`/api/nautilus/orders/${orderId}`, {
      method: 'DELETE',
    });
  }

  // ==========================================================================
  // Position Endpoints
  // ==========================================================================

  /**
   * Get all positions, optionally filtered by strategy
   */
  async getPositions(strategyId?: string): Promise<PositionInfo[]> {
    const params = strategyId ? `?strategy_id=${strategyId}` : '';
    return this.fetch<PositionInfo[]>(`/api/nautilus/positions${params}`);
  }

  // ==========================================================================
  // Trade Endpoints
  // ==========================================================================

  /**
   * Get trade history, optionally filtered by strategy
   */
  async getTrades(strategyId?: string, limit: number = 100): Promise<TradeInfo[]> {
    const params = new URLSearchParams();
    if (strategyId) params.append('strategy_id', strategyId);
    params.append('limit', limit.toString());
    
    const queryString = params.toString();
    return this.fetch<TradeInfo[]>(`/api/nautilus/trades${queryString ? '?' + queryString : ''}`);
  }

  // ==========================================================================
  // WebSocket Connection
  // ==========================================================================

  /**
   * Create WebSocket connection for real-time updates
   */
  createWebSocket(
    onMessage: (data: any) => void,
    onError?: (error: Event) => void,
    onClose?: (event: CloseEvent) => void
  ): WebSocket {
    // Use public Nautilus API WebSocket
    const wsUrl = this.baseUrl.replace('https://', 'wss://').replace('http://', 'ws://') + '/ws/nautilus';
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connected to Nautilus API');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      if (onError) onError(error);
    };

    ws.onclose = (event) => {
      console.log('WebSocket disconnected');
      if (onClose) onClose(event);
    };

    return ws;
  }
}

// ============================================================================
// Export singleton instance
// ============================================================================

export const nautilusApi = new NautilusApiClient();

// Also export the class for custom instances
export { NautilusApiClient };

