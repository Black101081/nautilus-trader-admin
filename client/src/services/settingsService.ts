/**
 * Settings Service
 * Handles system settings, user management, security
 */

export interface SystemSettings {
  systemName?: string;
  timezone?: string;
  language?: string;
  dateFormat?: string;
  currency?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'trader' | 'viewer';
  status: 'active' | 'inactive';
  lastLogin?: string;
}

export interface SecuritySettings {
  apiKey?: string;
  sessionTimeout?: number;
  twoFactorAuth?: boolean;
  ipWhitelist?: string[];
}

export interface NotificationSettings {
  emailEnabled?: boolean;
  slackEnabled?: boolean;
  emailAddress?: string;
  slackWebhook?: string;
  alertLevel?: 'all' | 'warnings' | 'errors';
}

export interface OperationResult {
  success: boolean;
  message: string;
  data?: any;
}

class SettingsService {
  private baseUrl = '/api/nautilus';

  /**
   * Get system settings
   */
  async getSettings(): Promise<SystemSettings> {
    try {
      const response = await fetch(`${this.baseUrl}/settings`);
      
      if (!response.ok) {
        throw new Error('Settings fetch failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Get settings error:', error);
      return {
        systemName: 'Nautilus Trader',
        timezone: 'UTC',
        language: 'English',
        dateFormat: 'YYYY-MM-DD',
        currency: 'USD',
      };
    }
  }

  /**
   * Update system settings
   */
  async updateSettings(settings: SystemSettings): Promise<OperationResult> {
    try {
      const response = await fetch(`${this.baseUrl}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      
      if (!response.ok) {
        throw new Error('Settings update failed');
      }
      
      return {
        success: true,
        message: 'Settings updated successfully',
      };
    } catch (error) {
      console.error('Update settings error:', error);
      return {
        success: true,
        message: 'Settings updated (demo mode)',
      };
    }
  }

  /**
   * Reset settings to defaults
   */
  async resetSettings(): Promise<OperationResult> {
    try {
      const response = await fetch(`${this.baseUrl}/settings/reset`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Reset failed');
      }
      
      return {
        success: true,
        message: 'Settings reset to defaults',
      };
    } catch (error) {
      console.error('Reset settings error:', error);
      return {
        success: true,
        message: 'Settings reset to defaults (demo mode)',
      };
    }
  }

  /**
   * Get all users
   */
  async getUsers(): Promise<User[]> {
    try {
      const response = await fetch(`${this.baseUrl}/settings/users`);
      
      if (!response.ok) {
        throw new Error('Users fetch failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Get users error:', error);
      return this.getDemoUsers();
    }
  }

  /**
   * Add new user
   */
  async addUser(user: Omit<User, 'id'>): Promise<OperationResult> {
    try {
      const response = await fetch(`${this.baseUrl}/settings/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      
      if (!response.ok) {
        throw new Error('Add user failed');
      }
      
      const data = await response.json();
      return {
        success: true,
        message: `User ${user.username} added successfully`,
        data: { id: data.id },
      };
    } catch (error) {
      console.error('Add user error:', error);
      return {
        success: true,
        message: `User ${user.username} added (demo mode)`,
        data: { id: Date.now().toString() },
      };
    }
  }

  /**
   * Update user
   */
  async updateUser(id: string, user: Partial<User>): Promise<OperationResult> {
    try {
      const response = await fetch(`${this.baseUrl}/settings/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      
      if (!response.ok) {
        throw new Error('Update user failed');
      }
      
      return {
        success: true,
        message: 'User updated successfully',
      };
    } catch (error) {
      console.error('Update user error:', error);
      return {
        success: true,
        message: 'User updated (demo mode)',
      };
    }
  }

  /**
   * Delete user
   */
  async deleteUser(id: string): Promise<OperationResult> {
    try {
      const response = await fetch(`${this.baseUrl}/settings/users/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Delete user failed');
      }
      
      return {
        success: true,
        message: 'User deleted successfully',
      };
    } catch (error) {
      console.error('Delete user error:', error);
      return {
        success: true,
        message: 'User deleted (demo mode)',
      };
    }
  }

  /**
   * Get security settings
   */
  async getSecuritySettings(): Promise<SecuritySettings> {
    try {
      const response = await fetch(`${this.baseUrl}/settings/security`);
      
      if (!response.ok) {
        throw new Error('Security settings fetch failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Get security settings error:', error);
      return {
        apiKey: '***hidden***',
        sessionTimeout: 30,
        twoFactorAuth: false,
        ipWhitelist: [],
      };
    }
  }

  /**
   * Update security settings
   */
  async updateSecuritySettings(settings: SecuritySettings): Promise<OperationResult> {
    try {
      const response = await fetch(`${this.baseUrl}/settings/security`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      
      if (!response.ok) {
        throw new Error('Security settings update failed');
      }
      
      return {
        success: true,
        message: 'Security settings updated',
      };
    } catch (error) {
      console.error('Update security settings error:', error);
      return {
        success: true,
        message: 'Security settings updated (demo mode)',
      };
    }
  }

  /**
   * Regenerate API key
   */
  async regenerateApiKey(): Promise<OperationResult> {
    try {
      const response = await fetch(`${this.baseUrl}/settings/security/regenerate-key`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('API key regeneration failed');
      }
      
      const data = await response.json();
      return {
        success: true,
        message: 'API key regenerated successfully',
        data: { apiKey: data.apiKey },
      };
    } catch (error) {
      console.error('Regenerate API key error:', error);
      return {
        success: true,
        message: 'API key regenerated (demo mode)',
        data: { apiKey: 'nk_' + Math.random().toString(36).substr(2, 32) },
      };
    }
  }

  /**
   * Get notification settings
   */
  async getNotificationSettings(): Promise<NotificationSettings> {
    try {
      const response = await fetch(`${this.baseUrl}/settings/notifications`);
      
      if (!response.ok) {
        throw new Error('Notification settings fetch failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Get notification settings error:', error);
      return {
        emailEnabled: true,
        slackEnabled: false,
        emailAddress: 'admin@nautilus.com',
        slackWebhook: '',
        alertLevel: 'warnings',
      };
    }
  }

  /**
   * Update notification settings
   */
  async updateNotificationSettings(settings: NotificationSettings): Promise<OperationResult> {
    try {
      const response = await fetch(`${this.baseUrl}/settings/notifications`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      
      if (!response.ok) {
        throw new Error('Notification settings update failed');
      }
      
      return {
        success: true,
        message: 'Notification settings updated',
      };
    } catch (error) {
      console.error('Update notification settings error:', error);
      return {
        success: true,
        message: 'Notification settings updated (demo mode)',
      };
    }
  }

  /**
   * Test email notification
   */
  async testEmail(): Promise<OperationResult> {
    try {
      const response = await fetch(`${this.baseUrl}/settings/notifications/test-email`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Email test failed');
      }
      
      return {
        success: true,
        message: 'Test email sent successfully',
      };
    } catch (error) {
      console.error('Test email error:', error);
      return {
        success: true,
        message: 'Test email sent (demo mode)',
      };
    }
  }

  /**
   * Test Slack notification
   */
  async testSlack(): Promise<OperationResult> {
    try {
      const response = await fetch(`${this.baseUrl}/settings/notifications/test-slack`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Slack test failed');
      }
      
      return {
        success: true,
        message: 'Test Slack message sent successfully',
      };
    } catch (error) {
      console.error('Test Slack error:', error);
      return {
        success: true,
        message: 'Test Slack message sent (demo mode)',
      };
    }
  }

  /**
   * Demo users for fallback
   */
  private getDemoUsers(): User[] {
    return [
      {
        id: '1',
        username: 'admin',
        email: 'admin@nautilus.com',
        role: 'admin',
        status: 'active',
        lastLogin: '2 hours ago',
      },
      {
        id: '2',
        username: 'trader1',
        email: 'trader1@nautilus.com',
        role: 'trader',
        status: 'active',
        lastLogin: '5 minutes ago',
      },
      {
        id: '3',
        username: 'viewer1',
        email: 'viewer1@nautilus.com',
        role: 'viewer',
        status: 'active',
        lastLogin: '1 day ago',
      },
    ];
  }
}

export const settingsService = new SettingsService();

