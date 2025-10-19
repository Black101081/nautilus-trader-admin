import React, { useState } from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { MetricCard, StatusBadge } from '@/components/admin';
import { 
  Settings, 
  Users, 
  Shield, 
  Bell,
  Database,
  Globe,
  Zap,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
} from 'lucide-react';

/**
 * Settings Page
 * Page 6 of 6 - System configuration and user management
 * Fully responsive with mobile-first design
 */

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'users' | 'security' | 'notifications'>('general');
  const [showApiKey, setShowApiKey] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // General Settings State
  const [generalSettings, setGeneralSettings] = useState({
    systemName: 'Nautilus Trader Admin',
    timezone: 'UTC',
    language: 'en',
    dateFormat: 'YYYY-MM-DD',
    currency: 'USD',
  });

  // Security Settings State
  const [securitySettings, setSecuritySettings] = useState({
    apiKey: 'sk_live_1234567890abcdef',
    sessionTimeout: '30',
    twoFactorAuth: true,
    ipWhitelist: '',
  });

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    slackNotifications: false,
    errorAlerts: true,
    warningAlerts: true,
    infoAlerts: false,
  });

  // Sample users data
  const users = [
    { id: 1, name: 'Admin User', email: 'admin@nautilus.com', role: 'Admin', status: 'active', lastLogin: '2025-10-19 04:20:00' },
    { id: 2, name: 'Trader 1', email: 'trader1@nautilus.com', role: 'Trader', status: 'active', lastLogin: '2025-10-19 03:45:00' },
    { id: 3, name: 'Trader 2', email: 'trader2@nautilus.com', role: 'Trader', status: 'active', lastLogin: '2025-10-18 22:30:00' },
    { id: 4, name: 'Viewer', email: 'viewer@nautilus.com', role: 'Viewer', status: 'inactive', lastLogin: '2025-10-15 10:00:00' },
  ];

  const handleSave = () => {
    console.log('Saving settings...');
    setHasChanges(false);
    // TODO: Implement API call
  };

  const handleReset = () => {
    console.log('Resetting settings...');
    setHasChanges(false);
    // TODO: Implement reset logic
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      {/* Main content with responsive margin */}
      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8">
        {/* Header - Responsive text sizes */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                System Settings
              </h1>
              <p className="text-sm md:text-base text-gray-600">
                Configure system preferences and manage users
              </p>
            </div>
            {hasChanges && (
              <div className="flex items-center gap-2 md:gap-3">
                <button 
                  onClick={handleReset}
                  className="px-3 md:px-4 py-2 text-sm md:text-base bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </button>
                <button 
                  onClick={handleSave}
                  className="px-3 md:px-4 py-2 text-sm md:text-base bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Summary Metrics - Responsive grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <MetricCard
            title="Total Users"
            value={users.length}
            subtitle="Registered accounts"
            color="blue"
            icon={<Users />}
          />
          <MetricCard
            title="Active Users"
            value={users.filter(u => u.status === 'active').length}
            subtitle="Currently active"
            color="green"
            icon={<Users />}
          />
          <MetricCard
            title="Admin Users"
            value={users.filter(u => u.role === 'Admin').length}
            subtitle="Full access"
            color="purple"
            icon={<Shield />}
          />
          <MetricCard
            title="Notifications"
            value={Object.values(notificationSettings).filter(v => v === true).length}
            subtitle="Enabled alerts"
            color="orange"
            icon={<Bell />}
          />
        </div>

        {/* Tabs - Responsive */}
        <div className="mb-6 border-b border-gray-200 overflow-x-auto">
          <div className="flex gap-2 md:gap-4 min-w-max">
            <button
              onClick={() => setActiveTab('general')}
              className={`px-3 md:px-4 py-2 text-sm md:text-base font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'general'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Settings className="h-4 w-4 inline mr-2" />
              General
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-3 md:px-4 py-2 text-sm md:text-base font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Users className="h-4 w-4 inline mr-2" />
              Users
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-3 md:px-4 py-2 text-sm md:text-base font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'security'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Shield className="h-4 w-4 inline mr-2" />
              Security
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-3 md:px-4 py-2 text-sm md:text-base font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'notifications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Bell className="h-4 w-4 inline mr-2" />
              Notifications
            </button>
          </div>
        </div>

        {/* General Settings Tab */}
        {activeTab === 'general' && (
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">
                General Settings
              </h2>
              <div className="space-y-4">
                {/* System Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    System Name
                  </label>
                  <input
                    type="text"
                    value={generalSettings.systemName}
                    onChange={(e) => {
                      setGeneralSettings({ ...generalSettings, systemName: e.target.value });
                      setHasChanges(true);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                  />
                </div>

                {/* Timezone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timezone
                  </label>
                  <select
                    value={generalSettings.timezone}
                    onChange={(e) => {
                      setGeneralSettings({ ...generalSettings, timezone: e.target.value });
                      setHasChanges(true);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">America/New York</option>
                    <option value="Europe/London">Europe/London</option>
                    <option value="Asia/Tokyo">Asia/Tokyo</option>
                    <option value="Asia/Ho_Chi_Minh">Asia/Ho Chi Minh</option>
                  </select>
                </div>

                {/* Language & Date Format - Responsive grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Language
                    </label>
                    <select
                      value={generalSettings.language}
                      onChange={(e) => {
                        setGeneralSettings({ ...generalSettings, language: e.target.value });
                        setHasChanges(true);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                    >
                      <option value="en">English</option>
                      <option value="vi">Tiếng Việt</option>
                      <option value="ja">日本語</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date Format
                    </label>
                    <select
                      value={generalSettings.dateFormat}
                      onChange={(e) => {
                        setGeneralSettings({ ...generalSettings, dateFormat: e.target.value });
                        setHasChanges(true);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                    >
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    </select>
                  </div>
                </div>

                {/* Currency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Currency
                  </label>
                  <select
                    value={generalSettings.currency}
                    onChange={(e) => {
                      setGeneralSettings({ ...generalSettings, currency: e.target.value });
                      setHasChanges(true);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="JPY">JPY - Japanese Yen</option>
                    <option value="VND">VND - Vietnamese Dong</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                  User Management
                </h2>
                <button className="px-3 md:px-4 py-2 text-sm md:text-base bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                  Add New User
                </button>
              </div>

              {/* Users Table - Responsive */}
              <div className="overflow-x-auto -mx-4 md:mx-0">
                <table className="w-full min-w-[640px]">
                  <thead className="bg-gray-50 border-y border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Last Login</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            user.role === 'Admin' ? 'bg-purple-100 text-purple-800' :
                            user.role === 'Trader' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <StatusBadge status={user.status as any} size="sm" />
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell">
                          {user.lastLogin}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">
                Security Settings
              </h2>
              <div className="space-y-4">
                {/* API Key */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Master API Key
                  </label>
                  <div className="flex gap-2">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={securitySettings.apiKey}
                      readOnly
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm md:text-base"
                    />
                    <button
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="px-3 md:px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Session Timeout */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Timeout (minutes)
                  </label>
                  <input
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => {
                      setSecuritySettings({ ...securitySettings, sessionTimeout: e.target.value });
                      setHasChanges(true);
                    }}
                    className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                  />
                </div>

                {/* Two-Factor Auth */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 text-sm md:text-base">Two-Factor Authentication</p>
                    <p className="text-xs md:text-sm text-gray-600">Require 2FA for all users</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={securitySettings.twoFactorAuth}
                      onChange={(e) => {
                        setSecuritySettings({ ...securitySettings, twoFactorAuth: e.target.checked });
                        setHasChanges(true);
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* IP Whitelist */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IP Whitelist (comma-separated)
                  </label>
                  <textarea
                    value={securitySettings.ipWhitelist}
                    onChange={(e) => {
                      setSecuritySettings({ ...securitySettings, ipWhitelist: e.target.value });
                      setHasChanges(true);
                    }}
                    rows={3}
                    placeholder="192.168.1.1, 10.0.0.1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">
                Notification Settings
              </h2>
              <div className="space-y-3">
                {[
                  { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive alerts via email' },
                  { key: 'slackNotifications', label: 'Slack Notifications', description: 'Send alerts to Slack channel' },
                  { key: 'errorAlerts', label: 'Error Alerts', description: 'Notify on system errors' },
                  { key: 'warningAlerts', label: 'Warning Alerts', description: 'Notify on warnings' },
                  { key: 'infoAlerts', label: 'Info Alerts', description: 'Notify on informational events' },
                ].map((setting) => (
                  <div key={setting.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 text-sm md:text-base">{setting.label}</p>
                      <p className="text-xs md:text-sm text-gray-600">{setting.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings[setting.key as keyof typeof notificationSettings] as boolean}
                        onChange={(e) => {
                          setNotificationSettings({ ...notificationSettings, [setting.key]: e.target.checked });
                          setHasChanges(true);
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SettingsPage;

