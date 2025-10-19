import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { publicProcedure, router } from "../../../_core/trpc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Nautilus Router
 * Handles Nautilus Trader integration and Python bridge
 */
export const nautilusRouter = router({
  /**
   * Get Nautilus Trader version
   */
  version: publicProcedure.query(async () => {
    return new Promise((resolve, reject) => {
      const pythonPath = "python3.11";
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
  
  /**
   * Get Nautilus system information
   */
  systemInfo: publicProcedure.query(async () => {
    return new Promise((resolve) => {
      const pythonPath = "python3.11";
      const serverDir = path.join(__dirname, "../../../");
      const code = `
import json
from nautilus_api import get_system_info
print(json.dumps(get_system_info()))
`;
      const proc = spawn(pythonPath, ["-c", code], {
        cwd: serverDir,
        env: { ...process.env, PYTHONPATH: serverDir }
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
  
  /**
   * Run a simple backtest
   */
  runBacktest: publicProcedure.mutation(async () => {
    return new Promise((resolve) => {
      const pythonPath = "python3.11";
      const serverDir = path.join(__dirname, "../../../");
      const code = `
import json
from nautilus_api import run_simple_backtest
print(json.dumps(run_simple_backtest()))
`;
      const proc = spawn(pythonPath, ["-c", code], {
        cwd: serverDir,
        env: { ...process.env, PYTHONPATH: serverDir }
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
  
  /**
   * List available indicators
   */
  listIndicators: publicProcedure.query(async () => {
    return new Promise((resolve) => {
      const pythonPath = "python3.11";
      const serverDir = path.join(__dirname, "../../../");
      const code = `
import json
from nautilus_api import list_available_indicators
print(json.dumps(list_available_indicators()))
`;
      const proc = spawn(pythonPath, ["-c", code], {
        cwd: serverDir,
        env: { ...process.env, PYTHONPATH: serverDir }
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
});

