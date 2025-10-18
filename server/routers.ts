import { COOKIE_NAME } from "@shared/const";
import { spawn } from "child_process";
import path from "path";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  nautilus: router({
    version: publicProcedure.query(async () => {
      return new Promise((resolve, reject) => {
        const pythonPath = "python3.11";
        const scriptPath = path.join(__dirname, "nautilus_api.py");
        const proc = spawn(pythonPath, ["-c", "import nautilus_trader; print(nautilus_trader.__version__)"]);
        
        let output = "";
        let error = "";
        
        proc.stdout.on("data", (data) => {
          output += data.toString();
        });
        
        proc.stderr.on("data", (data) => {
          error += data.toString();
        });
        
        proc.on("close", (code) => {
          if (code === 0) {
            resolve({ success: true, version: output.trim() });
          } else {
            resolve({ success: false, error: error || "Unknown error" });
          }
        });
        
        setTimeout(() => {
          proc.kill();
          reject(new Error("Timeout"));
        }, 5000);
      });
    }),
    
    systemInfo: publicProcedure.query(async () => {
      return new Promise((resolve) => {
        const pythonPath = "python3.11";
        const scriptPath = path.join(__dirname, "nautilus_api.py");
        const code = `
import json
from nautilus_api import get_system_info
print(json.dumps(get_system_info()))
`;
        const proc = spawn(pythonPath, ["-c", code], {
          cwd: __dirname,
          env: { ...process.env, PYTHONPATH: __dirname }
        });
        
        let output = "";
        
        proc.stdout.on("data", (data) => {
          output += data.toString();
        });
        
        proc.on("close", () => {
          try {
            const result = JSON.parse(output);
            resolve(result);
          } catch (e) {
            resolve({ success: false, error: "Failed to parse output" });
          }
        });
        
        setTimeout(() => {
          proc.kill();
          resolve({ success: false, error: "Timeout" });
        }, 5000);
      });
    }),
    
    runBacktest: publicProcedure.mutation(async () => {
      return new Promise((resolve) => {
        const pythonPath = "python3.11";
        const code = `
import json
from nautilus_api import run_simple_backtest
print(json.dumps(run_simple_backtest()))
`;
        const proc = spawn(pythonPath, ["-c", code], {
          cwd: __dirname,
          env: { ...process.env, PYTHONPATH: __dirname }
        });
        
        let output = "";
        
        proc.stdout.on("data", (data) => {
          output += data.toString();
        });
        
        proc.on("close", () => {
          try {
            const result = JSON.parse(output);
            resolve(result);
          } catch (e) {
            resolve({ success: false, error: "Failed to parse output", raw: output });
          }
        });
        
        setTimeout(() => {
          proc.kill();
          resolve({ success: false, error: "Timeout" });
        }, 10000);
      });
    }),
    
    listIndicators: publicProcedure.query(async () => {
      return new Promise((resolve) => {
        const pythonPath = "python3.11";
        const code = `
import json
from nautilus_api import list_available_indicators
print(json.dumps(list_available_indicators()))
`;
        const proc = spawn(pythonPath, ["-c", code], {
          cwd: __dirname,
          env: { ...process.env, PYTHONPATH: __dirname }
        });
        
        let output = "";
        
        proc.stdout.on("data", (data) => {
          output += data.toString();
        });
        
        proc.on("close", () => {
          try {
            const result = JSON.parse(output);
            resolve(result);
          } catch (e) {
            resolve({ success: false, error: "Failed to parse output" });
          }
        });
        
        setTimeout(() => {
          proc.kill();
          resolve({ success: false, error: "Timeout" });
        }, 5000);
      });
    }),
  }),
});

export type AppRouter = typeof appRouter;
