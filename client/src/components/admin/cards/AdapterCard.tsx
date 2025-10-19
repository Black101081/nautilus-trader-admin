import React from 'react';
import StatusBadge, { StatusType } from '../ui/StatusBadge';

export interface AdapterCardProps {
  name: string;
  type: 'data' | 'execution' | 'both';
  venue?: string;
  exchange?: string;
  status: StatusType;
  config?: {
    apiKey?: string;
    testnet?: boolean;
    [key: string]: any;
  };
  metrics?: {
    connections?: number;
    latency?: string;
    uptime?: string;
    lastSync?: string;
  };
  onConfigure?: () => void;
  onTest?: () => void;
  onToggle?: (enabled: boolean) => void;
}

const typeConfig = {
  data: { label: 'Data', color: 'bg-blue-100 text-blue-700' },
  execution: { label: 'Execution', color: 'bg-purple-100 text-purple-700' },
  both: { label: 'Data + Execution', color: 'bg-green-100 text-green-700' },
};

export const AdapterCard: React.FC<AdapterCardProps> = ({
  name,
  type,
  venue,
  exchange,
  status,
  config,
  metrics,
  onConfigure,
  onTest,
  onToggle,
}) => {
  const typeInfo = typeConfig[type];
  const isActive = status === 'active' || status === 'running';

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
            <span className={`text-xs font-medium px-2 py-1 rounded ${typeInfo.color}`}>
              {typeInfo.label}
            </span>
          </div>
          <p className="text-sm text-gray-600">Venue: {venue || exchange}</p>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Configuration */}
      {config && (
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <p className="text-xs font-semibold text-gray-700 mb-2">Configuration</p>
          <div className="space-y-1">
            {config.apiKey && (
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">API Key:</span>
                <span className="text-gray-900 font-mono">
                  {config.apiKey.substring(0, 8)}...
                </span>
              </div>
            )}
            {config.testnet !== undefined && (
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Testnet:</span>
                <span className={`font-medium ${config.testnet ? 'text-amber-600' : 'text-green-600'}`}>
                  {config.testnet ? 'Yes' : 'No'}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Metrics */}
      {metrics && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          {metrics.connections !== undefined && (
            <div>
              <p className="text-xs text-gray-500">Connections</p>
              <p className="text-sm font-semibold text-gray-900">{metrics.connections}</p>
            </div>
          )}
          {metrics.latency && (
            <div>
              <p className="text-xs text-gray-500">Latency</p>
              <p className="text-sm font-semibold text-gray-900">{metrics.latency}</p>
            </div>
          )}
          {metrics.uptime && (
            <div>
              <p className="text-xs text-gray-500">Uptime</p>
              <p className="text-sm font-semibold text-gray-900">{metrics.uptime}</p>
            </div>
          )}
          {metrics.lastSync && (
            <div>
              <p className="text-xs text-gray-500">Last Sync</p>
              <p className="text-sm font-semibold text-gray-900">{metrics.lastSync}</p>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-gray-100">
        {onToggle && (
          <button
            onClick={() => onToggle(!isActive)}
            className={`
              px-3 py-1.5 rounded-md text-sm font-medium transition-colors
              ${isActive
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
              }
            `}
          >
            {isActive ? 'Disable' : 'Enable'}
          </button>
        )}
        {onTest && (
          <button
            onClick={onTest}
            className="px-3 py-1.5 rounded-md text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            Test Connection
          </button>
        )}
        {onConfigure && (
          <button
            onClick={onConfigure}
            className="px-3 py-1.5 rounded-md text-sm font-medium bg-gray-200 hover:bg-gray-300 text-gray-800 transition-colors"
          >
            Configure
          </button>
        )}
      </div>
    </div>
  );
};

export default AdapterCard;

