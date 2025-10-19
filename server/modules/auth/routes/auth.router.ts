import { publicProcedure, router } from "../../../_core/trpc";
import { getSessionCookieOptions } from "../../../_core/cookies";

const COOKIE_NAME = "session"; // TODO: Import from config

/**
 * Authentication Router
 * Handles user authentication and session management
 */
export const authRouter = router({
  /**
   * Get current user information
   */
  me: publicProcedure.query(opts => opts.ctx.user),
  
  /**
   * Logout current user
   */
  logout: publicProcedure.mutation(({ ctx }) => {
    const cookieOptions = getSessionCookieOptions(ctx.req);
    ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
    return {
      success: true,
    } as const;
  }),
});

