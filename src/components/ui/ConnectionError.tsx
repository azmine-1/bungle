import React from 'react';

interface ConnectionErrorProps {
  message: string;
  isDarkMode: boolean;
}

const ConnectionError: React.FC<ConnectionErrorProps> = ({
  message,
  isDarkMode
}) => {
  return (
    <div className={`mb-4 p-3 rounded-lg border ${
      isDarkMode 
        ? 'bg-red-900/20 border-red-800/50 text-red-400' 
        : 'bg-red-50 border-red-200 text-red-700'
    }`}>
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm font-medium">Connection Error</span>
      </div>
      <p className="text-xs mt-1 opacity-90">{message}</p>
    </div>
  );
};

export default ConnectionError;