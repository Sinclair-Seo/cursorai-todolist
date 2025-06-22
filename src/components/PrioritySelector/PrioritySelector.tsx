import React from 'react';
import { PriorityLevel, PRIORITY_OPTIONS } from '../../types/todo';

interface PrioritySelectorProps {
  value: PriorityLevel | null;
  onChange: (priority: PriorityLevel | null) => void;
  label?: string;
  disabled?: boolean;
  includeAll?: boolean;
  placeholder?: string;
}

const PrioritySelector: React.FC<PrioritySelectorProps> = ({
  value,
  onChange,
  label = '우선순위',
  disabled = false,
  includeAll = false,
  placeholder = '우선순위 선택'
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      
      {includeAll ? (
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value ? Number(e.target.value) as PriorityLevel : null)}
          disabled={disabled}
          className="input w-full"
        >
          <option value="">{placeholder}</option>
          {PRIORITY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
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
      )}
    </div>
  );
};

export default PrioritySelector; 