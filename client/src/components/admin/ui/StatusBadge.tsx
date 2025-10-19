import React from 'react';
import { colors } from '../design-tokens';

export type StatusType = 
  | 'active' 
  | 'inactive' 
  | 'running' 
  | 'stopped' 
  | 'starting'
  | 'enabled' 
  | 'disabled' 
  | 'pending'
  | 'error'
  | 'warning'
  | 'success'
  | 'info'
  | 'connected'
  | 'disconnected'
  | 'connecting';

export interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

const statusConfig: Record<StatusType, { color: string; bgColor: string; label: string }> = {
  active: { color: 'text-green-700', bgColor: 'bg-green-100', label: 'Active' },
  inactive: { color: 'text-gray-700', bgColor: 'bg-gray-100', label: 'Inactive' },
  running: { color: 'text-green-700', bgColor: 'bg-green-100', label: 'Running' },
  stopped: { color: 'text-red-700', bgColor: 'bg-red-100', label: 'Stopped' },
  starting: { color: 'text-amber-700', bgColor: 'bg-amber-100', label: 'Starting' },
  enabled: { color: 'text-green-700', bgColor: 'bg-green-100', label: 'Enabled' },
  disabled: { color: 'text-gray-700', bgColor: 'bg-gray-100', label: 'Disabled' },
  pending: { color: 'text-amber-700', bgColor: 'bg-amber-100', label: 'Pending' },
  error: { color: 'text-red-700', bgColor: 'bg-red-100', label: 'Error' },
  warning: { color: 'text-amber-700', bgColor: 'bg-amber-100', label: 'Warning' },
  success: { color: 'text-green-700', bgColor: 'bg-green-100', label: 'Success' },
  info: { color: 'text-blue-700', bgColor: 'bg-blue-100', label: 'Info' },
  connected: { color: 'text-green-700', bgColor: 'bg-green-100', label: 'Connected' },
  disconnected: { color: 'text-gray-700', bgColor: 'bg-gray-100', label: 'Disconnected' },
  connecting: { color: 'text-amber-700', bgColor: 'bg-amber-100', label: 'Connecting' },
};

const sizeConfig = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

const dotSizeConfig = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
  lg: 'w-2.5 h-2.5',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = 'md',
  showDot = true,
}) => {
  const config = statusConfig[status];
  const displayLabel = label || config.label;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-full
        ${config.bgColor} ${config.color} ${sizeConfig[size]}
      `}
    >
      {showDot && (
        <span className={`${dotSizeConfig[size]} rounded-full bg-current`} />
      )}
      {displayLabel}
    </span>
  );
};

export default StatusBadge;

