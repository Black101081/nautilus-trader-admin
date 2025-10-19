import React from 'react';
import { colors, componentTokens, typography } from '../design-tokens';

export interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'amber' | 'red' | 'gray';
  onClick?: () => void;
}

const colorMap = {
  blue: 'bg-blue-50 border-blue-200',
  green: 'bg-green-50 border-green-200',
  amber: 'bg-amber-50 border-amber-200',
  red: 'bg-red-50 border-red-200',
  gray: 'bg-gray-50 border-gray-200',
};

const iconColorMap = {
  blue: 'text-blue-600',
  green: 'text-green-600',
  amber: 'text-amber-600',
  red: 'text-red-600',
  gray: 'text-gray-600',
};

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'gray',
  onClick,
}) => {
  return (
    <div
      className={`
        ${colorMap[color]}
        border rounded-lg p-6 transition-all duration-200
        ${onClick ? 'cursor-pointer hover:shadow-lg hover:scale-105' : ''}
      `}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center mt-2">
              <span
                className={`text-sm font-medium ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`${iconColorMap[color]} text-2xl`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;

