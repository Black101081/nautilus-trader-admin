import React from 'react';
import StatusBadge, { StatusType } from '../ui/StatusBadge';

export interface ComponentCardProps {
  name: string;
  description: string;
  status: StatusType;
  version?: string;
  metrics?: {
    label: string;
    value: string | number;
  }[];
  actions?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
    disabled?: boolean;
  }[];
  icon?: React.ReactNode;
}

const buttonVariants = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
};

export const ComponentCard: React.FC<ComponentCardProps> = ({
  name,
  description,
  status,
  version,
  metrics,
  actions,
  icon,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          {icon && (
            <div className="text-gray-600 text-2xl mt-1">
              {icon}
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
              {version && (
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                  v{version}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Metrics */}
      {metrics && metrics.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-gray-100">
          {metrics.map((metric, index) => (
            <div key={index}>
              <p className="text-xs text-gray-500 mb-1">{metric.label}</p>
              <p className="text-sm font-semibold text-gray-900">{metric.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      {actions && actions.length > 0 && (
        <div className="flex gap-2 pt-4 border-t border-gray-100">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              disabled={action.disabled}
              className={`
                px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                ${buttonVariants[action.variant || 'secondary']}
                ${action.disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComponentCard;

