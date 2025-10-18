/**
 * PostgreSQL helpers for querying trading data
 * This connects to the PostgreSQL database where NautilusTrader stores backtest results
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

/**
 * Execute Python script to query PostgreSQL
 */
async function execPython(script: string): Promise<any> {
  try {
    const { stdout, stderr } = await execAsync(
      `cd ${projectRoot}/server && python3.11 -c "${script.replace(/"/g, '\\"')}"`,
      { maxBuffer: 10 * 1024 * 1024 } // 10MB buffer
    );
    
    if (stderr && !stderr.includes('Warning')) {
      console.error('Python stderr:', stderr);
    }
    
    return stdout.trim() ? JSON.parse(stdout) : null;
  } catch (error: any) {
    console.error('Python execution error:', error.message);
    throw error;
  }
}

/**
 * Get all positions from PostgreSQL
 */
export async function getPostgresPositions(filters?: {
  status?: 'OPEN' | 'CLOSED';
  side?: 'LONG' | 'SHORT' | 'FLAT';
}) {
  const script = `
from postgres_manager import PostgreSQLManager
import json
from decimal import Decimal
from datetime import datetime

pm = PostgreSQLManager()
result = pm.query_table('positions', limit=100)

# Convert rows to dict format
positions = []
for row in result['rows']:
    pos = {
        'id': str(row[0]),
        'position_id': row[1],
        'instrument_id': row[2],
        'side': row[3],
        'quantity': float(row[4]) if row[4] else 0,
        'entry_price': float(row[5]) if row[5] else 0,
        'current_price': float(row[6]) if row[6] else 0,
        'unrealized_pnl': float(row[7]) if row[7] else 0,
        'realized_pnl': float(row[8]) if row[8] else 0,
        'status': row[9],
        'opened_at': row[10].isoformat() if row[10] else None,
        'closed_at': row[11].isoformat() if row[11] else None,
    }
    positions.append(pos)

print(json.dumps(positions))
`;

  const positions = await execPython(script);
  
  // Apply filters
  let filtered = positions || [];
  if (filters?.status) {
    filtered = filtered.filter((p: any) => p.status === filters.status);
  }
  if (filters?.side) {
    filtered = filtered.filter((p: any) => p.side === filters.side);
  }
  
  return filtered;
}

/**
 * Get all orders from PostgreSQL
 */
export async function getPostgresOrders(filters?: {
  status?: string;
  side?: 'BUY' | 'SELL';
}) {
  const script = `
from postgres_manager import PostgreSQLManager
import json
from decimal import Decimal
from datetime import datetime

pm = PostgreSQLManager()
result = pm.query_table('orders', limit=100)

# Convert rows to dict format
orders = []
for row in result['rows']:
    order = {
        'id': str(row[0]),
        'order_id': row[1],
        'instrument_id': row[2],
        'side': row[3],
        'order_type': row[4],
        'quantity': float(row[5]) if row[5] else 0,
        'price': float(row[6]) if row[6] else 0,
        'status': row[7],
        'filled_qty': float(row[8]) if row[8] else 0,
        'avg_px': float(row[9]) if row[9] else 0,
        'created_at': row[10].isoformat() if row[10] else None,
        'updated_at': row[11].isoformat() if row[11] else None,
    }
    orders.append(order)

print(json.dumps(orders))
`;

  const orders = await execPython(script);
  
  // Apply filters
  let filtered = orders || [];
  if (filters?.status) {
    filtered = filtered.filter((o: any) => o.status === filters.status);
  }
  if (filters?.side) {
    filtered = filtered.filter((o: any) => o.side === filters.side);
  }
  
  return filtered;
}

/**
 * Get all trades from PostgreSQL
 */
export async function getPostgresTrades(filters?: {
  side?: 'BUY' | 'SELL';
  limit?: number;
}) {
  const limit = filters?.limit || 100;
  
  const script = `
from postgres_manager import PostgreSQLManager
import json
from decimal import Decimal
from datetime import datetime

pm = PostgreSQLManager()
result = pm.query_table('trades', limit=${limit})

# Convert rows to dict format
trades = []
for row in result['rows']:
    trade = {
        'id': str(row[0]),
        'trade_id': row[1],
        'order_id': row[2],
        'instrument_id': row[3],
        'side': row[4],
        'quantity': float(row[5]) if row[5] else 0,
        'price': float(row[6]) if row[6] else 0,
        'commission': float(row[7]) if row[7] else 0,
        'realized_pnl': float(row[8]) if row[8] else 0,
        'executed_at': row[9].isoformat() if row[9] else None,
    }
    trades.append(trade)

print(json.dumps(trades))
`;

  const trades = await execPython(script);
  
  // Apply filters
  let filtered = trades || [];
  if (filters?.side) {
    filtered = filtered.filter((t: any) => t.side === filters.side);
  }
  
  return filtered;
}

/**
 * Get account information from PostgreSQL
 */
export async function getPostgresAccount() {
  const script = `
from postgres_manager import PostgreSQLManager
import json
from decimal import Decimal

pm = PostgreSQLManager()
result = pm.query_table('accounts', limit=1)

if result['rows']:
    row = result['rows'][0]
    account = {
        'id': str(row[0]),
        'account_id': row[1],
        'balance': float(row[2]) if row[2] else 0,
        'equity': float(row[3]) if row[3] else 0,
        'margin_used': float(row[4]) if row[4] else 0,
        'margin_available': float(row[5]) if row[5] else 0,
        'unrealized_pnl': float(row[6]) if row[6] else 0,
        'realized_pnl': float(row[7]) if row[7] else 0,
    }
    print(json.dumps(account))
else:
    print(json.dumps(None))
`;

  return await execPython(script);
}

/**
 * Calculate portfolio summary from positions and account
 */
export async function getPortfolioSummary() {
  const [positions, account] = await Promise.all([
    getPostgresPositions(),
    getPostgresAccount()
  ]);
  
  const openPositions = positions.filter((p: any) => p.status === 'OPEN');
  const totalUnrealizedPnL = openPositions.reduce((sum: number, p: any) => sum + p.unrealized_pnl, 0);
  const totalRealizedPnL = positions.reduce((sum: number, p: any) => sum + p.realized_pnl, 0);
  
  const initialBalance = account?.balance || 100000;
  const cashBalance = initialBalance - openPositions.reduce((sum: number, p: any) => 
    sum + (p.entry_price * p.quantity), 0
  );
  
  const totalValue = cashBalance + openPositions.reduce((sum: number, p: any) => 
    sum + (p.current_price * p.quantity), 0
  );
  
  const totalPnL = totalUnrealizedPnL + totalRealizedPnL;
  const returnPct = ((totalValue - initialBalance) / initialBalance) * 100;
  
  return {
    totalValue,
    initialBalance,
    cashBalance,
    totalPnL,
    returnPct,
    unrealizedPnL: totalUnrealizedPnL,
    realizedPnL: totalRealizedPnL,
    openPositions: openPositions.length,
  };
}

