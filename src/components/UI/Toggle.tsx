import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  color?: 'green' | 'purple';
  disabled?: boolean;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  color = 'green',
  disabled = false,
}) => {
  const colorClasses = {
    green: checked ? 'bg-primary-green' : 'bg-gray-300 dark:bg-gray-600',
    purple: checked ? 'bg-primary-purple' : 'bg-gray-300 dark:bg-gray-600',
  };

  return (
    <label className="flex items-center space-x-3 cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={`w-12 h-6 rounded-full transition-colors duration-200 ${
            colorClasses[color]
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
              checked ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </div>
      </div>
      {label && (
        <span className="text-sm font-medium text-gray-700 dark:text-dark-text">
          {label}
        </span>
      )}
    </label>
  );
};