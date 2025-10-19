import React, { useState } from 'react';

export interface FeatureToggleProps {
  featureName: string;
  description?: string;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  disabled?: boolean;
  category?: string;
  dependencies?: string[];
}

export const FeatureToggle: React.FC<FeatureToggleProps> = ({
  featureName,
  description,
  enabled,
  onToggle,
  disabled = false,
  category,
  dependencies,
}) => {
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async () => {
    if (disabled || isToggling) return;
    
    setIsToggling(true);
    try {
      await onToggle(!enabled);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 mr-4">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-semibold text-gray-900">{featureName}</h4>
            {category && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                {category}
              </span>
            )}
          </div>
          {description && (
            <p className="text-xs text-gray-600 mb-2">{description}</p>
          )}
          {dependencies && dependencies.length > 0 && (
            <div className="text-xs text-gray-500">
              <span className="font-medium">Dependencies:</span>{' '}
              {dependencies.join(', ')}
            </div>
          )}
        </div>

        {/* Toggle Switch */}
        <button
          onClick={handleToggle}
          disabled={disabled || isToggling}
          className={`
            relative inline-flex h-6 w-11 items-center rounded-full transition-colors
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            ${enabled ? 'bg-blue-600' : 'bg-gray-300'}
            ${disabled || isToggling ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          aria-label={`Toggle ${featureName}`}
        >
          <span
            className={`
              inline-block h-4 w-4 transform rounded-full bg-white transition-transform
              ${enabled ? 'translate-x-6' : 'translate-x-1'}
            `}
          />
        </button>
      </div>

      {/* Status indicator */}
      <div className="mt-2 flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${enabled ? 'bg-green-500' : 'bg-gray-400'}`} />
        <span className="text-xs text-gray-600">
          {isToggling ? 'Updating...' : enabled ? 'Enabled' : 'Disabled'}
        </span>
      </div>
    </div>
  );
};

export default FeatureToggle;

