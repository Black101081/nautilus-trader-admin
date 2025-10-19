import { z } from "zod";
import { exec as execCallback } from "child_process";
import { promisify } from "util";
import path from "path";
import { fileURLToPath } from "url";
import { publicProcedure, router } from "../../../_core/trpc";

const exec = promisify(execCallback);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Nautilus Core Router
 * Handles Nautilus Core system management and monitoring
 */
export const nautilusCoreRouter = router({
  /**
   * Get system status
   */
  getSystemStatus: publicProcedure.query(async () => {
    try {
      const projectRoot = path.join(__dirname, "../../../..");
      const { stdout } = await exec(`cd ${projectRoot} && python3.11 -c "from server.nautilus_bridge import get_system_status; import json; print(json.dumps(get_system_status()))"`);
      return JSON.parse(stdout.trim());
    } catch (error: any) {
      return { status: "error", message: error.message };
    }
  }),

  /**
   * Get component status
   */
  getComponentStatus: publicProcedure
    .input(z.object({ component: z.string() }))
    .query(async ({ input }) => {
      try {
        const projectRoot = path.join(__dirname, "../../../..");
        const { stdout } = await exec(`cd ${projectRoot} && python3.11 -c "from server.nautilus_bridge import get_component_status; import json; print(json.dumps(get_component_status('${input.component}')))"`);
        return JSON.parse(stdout.trim());
      } catch (error: any) {
        return { error: error.message };
      }
    }),

  /**
   * Get all components
   */
  getAllComponents: publicProcedure.query(async () => {
    try {
      const projectRoot = path.join(__dirname, "../../../..");
      const { stdout } = await exec(`cd ${projectRoot} && python3.11 -c "from server.nautilus_bridge import get_all_components; import json; print(json.dumps(get_all_components()))"`);
      return JSON.parse(stdout.trim());
    } catch (error: any) {
      return [];
    }
  }),

  /**
   * Get system metrics
   */
  getSystemMetrics: publicProcedure.query(async () => {
    try {
      const projectRoot = path.join(__dirname, "../../../..");
      const { stdout } = await exec(`cd ${projectRoot} && python3.11 -c "from server.nautilus_bridge import get_system_metrics; import json; print(json.dumps(get_system_metrics()))"`);
      return JSON.parse(stdout.trim());
    } catch (error: any) {
      return { error: error.message };
    }
  }),

  /**
   * Get trading metrics
   */
  getTradingMetrics: publicProcedure.query(async () => {
    try {
      const projectRoot = path.join(__dirname, "../../../..");
      const { stdout } = await exec(`cd ${projectRoot} && python3.11 -c "from server.nautilus_bridge import get_trading_metrics; import json; print(json.dumps(get_trading_metrics()))"`);
      return JSON.parse(stdout.trim());
    } catch (error: any) {
      return { error: error.message };
    }
  }),

  /**
   * Get logs
   */
  getLogs: publicProcedure
    .input(z.object({ 
      component: z.string().optional(),
      level: z.string().default("INFO"),
      limit: z.number().default(100)
    }))
    .query(async ({ input }) => {
      try {
        const projectRoot = path.join(__dirname, "../../../..");
        const component = input.component ? `'${input.component}'` : "None";
        const { stdout } = await exec(`cd ${projectRoot} && python3.11 -c "from server.nautilus_bridge import get_logs; import json; print(json.dumps(get_logs(${component}, '${input.level}', ${input.limit})))"`);
        return JSON.parse(stdout.trim());
      } catch (error: any) {
        return [];
      }
    }),

  /**
   * Restart a component
   */
  restartComponent: publicProcedure
    .input(z.object({ component: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const projectRoot = path.join(__dirname, "../../../..");
        const { stdout } = await exec(`cd ${projectRoot} && python3.11 -c "from server.nautilus_bridge import restart_component; import json; print(json.dumps(restart_component('${input.component}')))"`);
        return JSON.parse(stdout.trim());
      } catch (error: any) {
        return { success: false, message: error.message };
      }
    }),

  /**
   * Emergency stop all components
   */
  emergencyStopAll: publicProcedure.mutation(async () => {
    try {
      const projectRoot = path.join(__dirname, "../../../..");
      const { stdout } = await exec(`cd ${projectRoot} && python3.11 -c "from server.nautilus_bridge import emergency_stop_all; import json; print(json.dumps(emergency_stop_all()))"`);
      return JSON.parse(stdout.trim());
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }),

  /**
   * Get all features
   */
  getAllFeatures: publicProcedure.query(async () => {
    try {
      const projectRoot = path.join(__dirname, "../../../..");
      const { stdout } = await exec(`cd ${projectRoot} && python3.11 -c "from server.feature_manager import get_all_features; import json; print(json.dumps(get_all_features()))"`);
      return JSON.parse(stdout.trim());
    } catch (error: any) {
      return { features: [], total: 0, categories: [] };
    }
  }),

  /**
   * Get features by category
   */
  getFeaturesByCategory: publicProcedure
    .input(z.object({ category: z.string() }))
    .query(async ({ input }) => {
      try {
        const projectRoot = path.join(__dirname, "../../../..");
        const { stdout } = await exec(`cd ${projectRoot} && python3.11 -c "from server.feature_manager import get_features_by_category; import json; print(json.dumps(get_features_by_category('${input.category}')))"`);
        return JSON.parse(stdout.trim());
      } catch (error: any) {
        return [];
      }
    }),

  /**
   * Get feature status summary
   */
  getFeatureStatusSummary: publicProcedure.query(async () => {
    try {
      const projectRoot = path.join(__dirname, "../../../..");
      const { stdout } = await exec(`cd ${projectRoot} && python3.11 -c "from server.feature_manager import get_feature_status_summary; import json; print(json.dumps(get_feature_status_summary()))"`);
      return JSON.parse(stdout.trim());
    } catch (error: any) {
      return { available: 0, configured: 0, requires_config: 0, requires_data: 0 };
    }
  }),

  /**
   * Get all services
   */
  getAllServices: publicProcedure.query(async () => {
    try {
      const projectRoot = path.join(__dirname, "../../../..");
      const { stdout } = await exec(`cd ${projectRoot} && python3.11 -c "from server.feature_manager import get_all_services; import json; print(json.dumps(get_all_services()))"`);
      return JSON.parse(stdout.trim());
    } catch (error: any) {
      return { services: [], total: 0 };
    }
  }),

  /**
   * Get core components
   */
  getCoreComponents: publicProcedure.query(async () => {
    try {
      const projectRoot = path.join(__dirname, "../../../..");
      const { stdout } = await exec(`cd ${projectRoot} && python3.11 -c "from server.feature_manager import get_core_components; import json; print(json.dumps(get_core_components()))"`);
      return JSON.parse(stdout.trim());
    } catch (error: any) {
      return [];
    }
  }),

  /**
   * Get component health summary
   */
  getComponentHealthSummary: publicProcedure.query(async () => {
    try {
      const projectRoot = path.join(__dirname, "../../../..");
      const { stdout } = await exec(`cd ${projectRoot} && python3.11 -c "from server.feature_manager import get_component_health_summary; import json; print(json.dumps(get_component_health_summary()))"`);
      return JSON.parse(stdout.trim());
    } catch (error: any) {
      return { healthy: 0, degraded: 0, unhealthy: 0, stopped: 0 };
    }
  }),
});

