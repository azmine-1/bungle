import React from 'react';

interface ErrorProps {
  message: string;
  onRetry: () => void;
}

const Error: React.FC<ErrorProps> = ({ message, onRetry }) => {
  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="text-center max-w-sm sm:max-w-md">
        <div className="text-red-500 text-lg sm:text-xl mb-4">⚠️ Error</div>
        <p className="text-gray-600 mb-4 text-sm sm:text-base">{message}</p>
        <button
          onClick={onRetry}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm sm:text-base"
        >
          Retry
        </button>
      </div>
    </div>
  );
};

export default Error; 