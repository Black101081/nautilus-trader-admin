import React, { useState, useRef, useEffect } from 'react';

export type LogLevel = 'debug' | 'info' | 'warning' | 'error' | 'critical';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  component: string;
  message: string;
  metadata?: Record<string, any>;
}

export interface LogViewerProps {
  logs: LogEntry[];
  maxHeight?: string;
  autoScroll?: boolean;
  showFilters?: boolean;
  onRefresh?: () => void;
}

const levelConfig: Record<LogLevel, { color: string; bgColor: string; label: string }> = {
  debug: { color: 'text-gray-700', bgColor: 'bg-gray-100', label: 'DEBUG' },
  info: { color: 'text-blue-700', bgColor: 'bg-blue-100', label: 'INFO' },
  warning: { color: 'text-amber-700', bgColor: 'bg-amber-100', label: 'WARN' },
  error: { color: 'text-red-700', bgColor: 'bg-red-100', label: 'ERROR' },
  critical: { color: 'text-red-900', bgColor: 'bg-red-200', label: 'CRIT' },
};

export const LogViewer: React.FC<LogViewerProps> = ({
  logs,
  maxHeight = '500px',
  autoScroll = true,
  showFilters = true,
  onRefresh,
}) => {
  const [selectedLevels, setSelectedLevels] = useState<Set<LogLevel>>(
    new Set(['debug', 'info', 'warning', 'error', 'critical'])
  );
  const [searchTerm, setSearchTerm] = useState('');
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (autoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  const toggleLevel = (level: LogLevel) => {
    const newLevels = new Set(selectedLevels);
    if (newLevels.has(level)) {
      newLevels.delete(level);
    } else {
      newLevels.add(level);
    }
    setSelectedLevels(newLevels);
  };

  const filteredLogs = logs.filter((log) => {
    const levelMatch = selectedLevels.has(log.level);
    const searchMatch = searchTerm === '' || 
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.component.toLowerCase().includes(searchTerm.toLowerCase());
    return levelMatch && searchMatch;
  });

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Filters */}
      {showFilters && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-2">
              {(Object.keys(levelConfig) as LogLevel[]).map((level) => {
                const config = levelConfig[level];
                const isSelected = selectedLevels.has(level);
                return (
                  <button
                    key={level}
                    onClick={() => toggleLevel(level)}
                    className={`
                      px-2 py-1 rounded text-xs font-medium transition-all
                      ${isSelected 
                        ? `${config.bgColor} ${config.color}` 
                        : 'bg-gray-200 text-gray-500'
                      }
                    `}
                  >
                    {config.label}
                  </button>
                );
              })}
            </div>
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="px-3 py-1 rounded text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                Refresh
              </button>
            )}
          </div>
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {/* Logs */}
      <div 
        className="overflow-y-auto font-mono text-xs"
        style={{ maxHeight }}
      >
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No logs to display
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredLogs.map((log, index) => {
              const config = levelConfig[log.level];
              return (
                <div key={index} className="p-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <span className="text-gray-500 whitespace-nowrap">
                      {log.timestamp}
                    </span>
                    <span className={`${config.color} ${config.bgColor} px-2 py-0.5 rounded font-semibold whitespace-nowrap`}>
                      {config.label}
                    </span>
                    <span className="text-blue-600 whitespace-nowrap">
                      [{log.component}]
                    </span>
                    <span className="text-gray-900 flex-1">
                      {log.message}
                    </span>
                  </div>
                  {log.metadata && Object.keys(log.metadata).length > 0 && (
                    <div className="mt-1 ml-12 text-gray-600">
                      {JSON.stringify(log.metadata, null, 2)}
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={logsEndRef} />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-600">
        Showing {filteredLogs.length} of {logs.length} logs
      </div>
    </div>
  );
};

export default LogViewer;

