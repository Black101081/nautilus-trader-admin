import React from 'react';

export interface DataPoint {
  timestamp: string;
  value: number;
  label?: string;
}

export interface MetricChartProps {
  title: string;
  data: DataPoint[];
  type?: 'line' | 'bar' | 'area';
  color?: 'blue' | 'green' | 'amber' | 'red' | 'purple';
  height?: string;
  showGrid?: boolean;
  showLegend?: boolean;
  unit?: string;
}

const colorMap = {
  blue: { stroke: '#3b82f6', fill: '#93c5fd', bg: '#eff6ff' },
  green: { stroke: '#10b981', fill: '#6ee7b7', bg: '#f0fdf4' },
  amber: { stroke: '#f59e0b', fill: '#fcd34d', bg: '#fffbeb' },
  red: { stroke: '#ef4444', fill: '#fca5a5', bg: '#fef2f2' },
  purple: { stroke: '#8b5cf6', fill: '#c4b5fd', bg: '#faf5ff' },
};

export const MetricChart: React.FC<MetricChartProps> = ({
  title,
  data,
  type = 'line',
  color = 'blue',
  height = '200px',
  showGrid = true,
  showLegend = true,
  unit = '',
}) => {
  const colors = colorMap[color];

  // Calculate min/max for scaling
  const values = data.map(d => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue || 1;

  // Simple SVG-based chart rendering
  const chartWidth = 100; // percentage
  const chartHeight = 100; // percentage
  const padding = 10;

  const points = data.map((point, index) => {
    const x = (index / (data.length - 1 || 1)) * (chartWidth - 2 * padding) + padding;
    const y = chartHeight - padding - ((point.value - minValue) / range) * (chartHeight - 2 * padding);
    return { x, y, ...point };
  });

  // Create path for line/area chart
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1]?.x || 0} ${chartHeight - padding} L ${points[0]?.x || 0} ${chartHeight - padding} Z`;

  // Calculate statistics
  const currentValue = values[values.length - 1] || 0;
  const avgValue = values.reduce((a, b) => a + b, 0) / values.length || 0;
  const trend = values.length >= 2 ? values[values.length - 1] - values[values.length - 2] : 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">
              {currentValue.toFixed(2)}
            </span>
            <span className="text-sm text-gray-500">{unit}</span>
            {trend !== 0 && (
              <span className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend > 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(2)}
              </span>
            )}
          </div>
        </div>
        {showLegend && (
          <div className="text-xs text-gray-600">
            <div>Avg: {avgValue.toFixed(2)} {unit}</div>
            <div>Max: {maxValue.toFixed(2)} {unit}</div>
          </div>
        )}
      </div>

      {/* Chart */}
      <div style={{ height }} className="relative">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          {/* Grid lines */}
          {showGrid && (
            <g className="opacity-20">
              {[0, 25, 50, 75, 100].map((y) => (
                <line
                  key={y}
                  x1={padding}
                  y1={y}
                  x2={chartWidth - padding}
                  y2={y}
                  stroke="#9ca3af"
                  strokeWidth="0.5"
                />
              ))}
            </g>
          )}

          {/* Area fill (for area chart) */}
          {type === 'area' && (
            <path
              d={areaPath}
              fill={colors.fill}
              opacity="0.3"
            />
          )}

          {/* Line */}
          {(type === 'line' || type === 'area') && (
            <path
              d={linePath}
              fill="none"
              stroke={colors.stroke}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Bars */}
          {type === 'bar' && points.map((point, index) => {
            const barWidth = (chartWidth - 2 * padding) / data.length * 0.8;
            const barHeight = ((point.value - minValue) / range) * (chartHeight - 2 * padding);
            return (
              <rect
                key={index}
                x={point.x - barWidth / 2}
                y={chartHeight - padding - barHeight}
                width={barWidth}
                height={barHeight}
                fill={colors.stroke}
                opacity="0.8"
              />
            );
          })}

          {/* Data points */}
          {(type === 'line' || type === 'area') && points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="2"
              fill={colors.stroke}
            />
          ))}
        </svg>
      </div>

      {/* Time labels */}
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <span>{data[0]?.timestamp || ''}</span>
        <span>{data[data.length - 1]?.timestamp || ''}</span>
      </div>
    </div>
  );
};

export default MetricChart;

