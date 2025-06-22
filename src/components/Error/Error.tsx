import React from 'react';
import { Button } from '../common';

interface ErrorProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

const Error: React.FC<ErrorProps> = ({
  message,
  onRetry,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <div className="w-16 h-16 mb-4 text-danger-500">
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
        오류가 발생했습니다
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-md">
        {message}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="primary" size="sm">
          다시 시도
        </Button>
      )}
    </div>
  );
};

export default Error; 