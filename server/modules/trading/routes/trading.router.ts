import { z } from "zod";
import { publicProcedure, router } from "../../../_core/trpc";

/**
 * Trading Router
 * Handles trading operations: positions, orders, trades
 */
export const tradingRouter = router({
  /**
   * Get positions with optional filtering
   */
  positions: publicProcedure
    .input(
      z.object({
        status: z.enum(['OPEN', 'CLOSED']).optional(),
        instrument_id: z.string().optional(),
        side: z.enum(['LONG', 'SHORT']).optional(),
        limit: z.number().int().positive().max(1000).optional(),
        offset: z.number().int().nonnegative().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const { getPostgresPositions } = await import("../../../postgres_helpers");
      return await getPostgresPositions(input || { status: 'OPEN' });
    }),

  /**
   * Get orders with optional filtering
   */
  orders: publicProcedure
    .input(
      z.object({
        status: z.enum(['PENDING', 'FILLED', 'PARTIALLY_FILLED', 'CANCELED', 'REJECTED']).optional(),
        instrument_id: z.string().optional(),
        side: z.enum(['BUY', 'SELL']).optional(),
        order_type: z.enum(['MARKET', 'LIMIT', 'STOP', 'STOP_LIMIT']).optional(),
        limit: z.number().int().positive().max(1000).optional(),
        offset: z.number().int().nonnegative().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const { getPostgresOrders } = await import("../../../postgres_helpers");
      return await getPostgresOrders(input || {});
    }),

  /**
   * Get trade history with optional filtering
   */
  trades: publicProcedure
    .input(
      z.object({
        instrument_id: z.string().optional(),
        side: z.enum(['BUY', 'SELL']).optional(),
        limit: z.number().int().positive().max(1000).optional(),
        offset: z.number().int().nonnegative().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const { getPostgresTrades } = await import("../../../postgres_helpers");
      return await getPostgresTrades(input || {});
    }),

  /**
   * Get live trades (recent 50)
   */
  liveTrades: publicProcedure.query(async () => {
    const { getLiveTrades } = await import("../../../db_helpers");
    return await getLiveTrades({ limit: 50 });
  }),

  /**
   * Open a new trade
   */
  openTrade: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        strategyId: z.string().optional(),
        symbol: z.string(),
        side: z.enum(["buy", "sell"]),
        quantity: z.string(),
        entryPrice: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { createLiveTrade } = await import("../../../db_helpers");
      return await createLiveTrade(input);
    }),

  /**
   * Close an existing trade
   */
  closeTrade: publicProcedure
    .input(
      z.object({
        id: z.string(),
        exitPrice: z.string(),
        pnl: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { closeLiveTrade } = await import("../../../db_helpers");
      return await closeLiveTrade(input.id, input.exitPrice, input.pnl);
    }),
});

