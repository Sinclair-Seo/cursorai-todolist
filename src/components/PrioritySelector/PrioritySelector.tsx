import React from 'react';
import { PriorityLevel, PRIORITY_OPTIONS } from '../../types/todo';

interface PrioritySelectorProps {
  value: PriorityLevel;
  onChange: (priority: PriorityLevel) => void;
  label?: string;
  disabled?: boolean;
}

const PrioritySelector: React.FC<PrioritySelectorProps> = ({
  value,
  onChange,
  label = '우선순위',
  disabled = false
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <div className="flex gap-2">
        {PRIORITY_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            disabled={disabled}
            className={`
              flex-1 px-3 py-2 rounded-lg border-2 transition-all duration-200 font-medium text-sm
              ${value === option.value 
                ? `${option.bgColor} ${option.color} border-current` 
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-500'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PrioritySelector; 