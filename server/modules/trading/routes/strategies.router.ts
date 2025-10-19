import { z } from "zod";
import { nanoid } from "nanoid";
import { publicProcedure, router } from "../../../_core/trpc";
import * as db from "../../../db";

/**
 * Strategies Router
 * Handles strategy management: list, create, update, delete
 */
export const strategiesRouter = router({
  /**
   * List all strategies
   */
  list: publicProcedure.query(async () => {
    const allStrategies = await db.getStrategies("system");
    return allStrategies;
  }),

  /**
   * Get a specific strategy by ID
   */
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await db.getStrategy(input.id);
    }),

  /**
   * Create a new strategy
   */
  create: publicProcedure
    .input(z.object({
      name: z.string(),
      description: z.string().optional(),
      code: z.string(),
      parameters: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const id = nanoid();
      await db.createStrategy({
        id,
        ...input,
        createdBy: "system",
      });
      return { id };
    }),

  /**
   * Update an existing strategy
   */
  update: publicProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().optional(),
      description: z.string().optional(),
      code: z.string().optional(),
      parameters: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...updates } = input;
      await db.updateStrategy(id, { ...updates, updatedAt: new Date() });
      return { success: true };
    }),

  /**
   * Delete a strategy
   */
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await db.deleteStrategy(input.id);
      return { success: true };
    }),
});

