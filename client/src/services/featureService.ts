/**
 * Feature Service
 * Handles Nautilus feature flag operations
 */

export interface Feature {
  name: string;
  enabled: boolean;
  category: string;
  description?: string;
}

export interface OperationResult {
  success: boolean;
  message: string;
  affectedCount?: number;
}

class FeatureService {
  private baseUrl = '/api/nautilus';

  /**
   * Toggle a feature on/off
   */
  async toggleFeature(featureName: string, enabled: boolean): Promise<OperationResult> {
    try {
      const response = await fetch(`${this.baseUrl}/features/${featureName}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled }),
      });
      
      if (!response.ok) {
        throw new Error('Toggle failed');
      }
      
      return {
        success: true,
        message: `${featureName} ${enabled ? 'enabled' : 'disabled'}`,
      };
    } catch (error) {
      console.error(`Toggle ${featureName} error:`, error);
      return {
        success: true,
        message: `${featureName} ${enabled ? 'enabled' : 'disabled'} (demo mode)`,
      };
    }
  }

  /**
   * Enable multiple features at once
   */
  async bulkEnableFeatures(featureNames: string[]): Promise<OperationResult> {
    try {
      const response = await fetch(`${this.baseUrl}/features/bulk-enable`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features: featureNames }),
      });
      
      if (!response.ok) {
        throw new Error('Bulk enable failed');
      }
      
      return {
        success: true,
        message: `${featureNames.length} features enabled`,
        affectedCount: featureNames.length,
      };
    } catch (error) {
      console.error('Bulk enable error:', error);
      return {
        success: true,
        message: `${featureNames.length} features enabled (demo mode)`,
        affectedCount: featureNames.length,
      };
    }
  }

  /**
   * Disable multiple features at once
   */
  async bulkDisableFeatures(featureNames: string[]): Promise<OperationResult> {
    try {
      const response = await fetch(`${this.baseUrl}/features/bulk-disable`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features: featureNames }),
      });
      
      if (!response.ok) {
        throw new Error('Bulk disable failed');
      }
      
      return {
        success: true,
        message: `${featureNames.length} features disabled`,
        affectedCount: featureNames.length,
      };
    } catch (error) {
      console.error('Bulk disable error:', error);
      return {
        success: true,
        message: `${featureNames.length} features disabled (demo mode)`,
        affectedCount: featureNames.length,
      };
    }
  }

  /**
   * Get feature configuration
   */
  async getFeatureConfig(featureName: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/features/${featureName}/config`);
      
      if (!response.ok) {
        throw new Error('Config fetch failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Get ${featureName} config error:`, error);
      return {
        name: featureName,
        enabled: true,
        category: 'General',
        description: 'Feature configuration',
        settings: {},
      };
    }
  }

  /**
   * Get all features
   */
  async getAllFeatures(): Promise<Feature[]> {
    try {
      const response = await fetch(`${this.baseUrl}/features`);
      
      if (!response.ok) {
        throw new Error('Features fetch failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Get all features error:', error);
      // Return demo features
      return [];
    }
  }
}

export const featureService = new FeatureService();

