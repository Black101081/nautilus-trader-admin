import React, { useState } from 'react';
import StatusBadge, { StatusType } from '../ui/StatusBadge';

export interface ServiceControlProps {
  serviceName: string;
  description?: string;
  status: StatusType;
  component: string;
  metrics?: {
    uptime?: string;
    requests?: number;
    errors?: number;
    latency?: string;
  };
  onStart?: () => Promise<void>;
  onStop?: () => Promise<void>;
  onRestart?: () => Promise<void>;
  onConfigure?: () => void;
}

export const ServiceControl: React.FC<ServiceControlProps> = ({
  serviceName,
  description,
  status,
  component,
  metrics,
  onStart,
  onStop,
  onRestart,
  onConfigure,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAction = async (action: () => Promise<void>) => {
    setIsLoading(true);
    setError(null);
    try {
      await action();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setIsLoading(false);
    }
  };

  const canStart = status === 'stopped' || status === 'disabled';
  const canStop = status === 'running' || status === 'active';
  const canRestart = status === 'running' || status === 'active';

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-base font-semibold text-gray-900">{serviceName}</h4>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
              {component}
            </span>
          </div>
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
          )}
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Metrics */}
      {metrics && (
        <div className="grid grid-cols-4 gap-3 mb-4 p-3 bg-gray-50 rounded-md">
          {metrics.uptime && (
            <div>
              <p className="text-xs text-gray-500">Uptime</p>
              <p className="text-sm font-semibold text-gray-900">{metrics.uptime}</p>
            </div>
          )}
          {metrics.requests !== undefined && (
            <div>
              <p className="text-xs text-gray-500">Requests</p>
              <p className="text-sm font-semibold text-gray-900">{metrics.requests.toLocaleString()}</p>
            </div>
          )}
          {metrics.errors !== undefined && (
            <div>
              <p className="text-xs text-gray-500">Errors</p>
              <p className="text-sm font-semibold text-red-600">{metrics.errors}</p>
            </div>
          )}
          {metrics.latency && (
            <div>
              <p className="text-xs text-gray-500">Latency</p>
              <p className="text-sm font-semibold text-gray-900">{metrics.latency}</p>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {onStart && (
          <button
            onClick={() => handleAction(onStart)}
            disabled={!canStart || isLoading}
            className={`
              px-3 py-1.5 rounded-md text-sm font-medium transition-colors
              ${canStart && !isLoading
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            {isLoading ? '...' : 'Start'}
          </button>
        )}
        {onStop && (
          <button
            onClick={() => handleAction(onStop)}
            disabled={!canStop || isLoading}
            className={`
              px-3 py-1.5 rounded-md text-sm font-medium transition-colors
              ${canStop && !isLoading
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            {isLoading ? '...' : 'Stop'}
          </button>
        )}
        {onRestart && (
          <button
            onClick={() => handleAction(onRestart)}
            disabled={!canRestart || isLoading}
            className={`
              px-3 py-1.5 rounded-md text-sm font-medium transition-colors
              ${canRestart && !isLoading
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            {isLoading ? '...' : 'Restart'}
          </button>
        )}
        {onConfigure && (
          <button
            onClick={onConfigure}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-md text-sm font-medium bg-gray-200 hover:bg-gray-300 text-gray-800 transition-colors"
          >
            Configure
          </button>
        )}
      </div>
    </div>
  );
};

export default ServiceControl;

