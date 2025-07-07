import React from 'react';

interface EmptyStateProps {
  isDarkMode: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({ isDarkMode }) => {
  return (
    <div className="text-center py-8 sm:py-12">
      <div className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
        isDarkMode ? 'bg-gray-800/50 text-gray-500' : 'bg-gray-100/50 text-gray-400'
      }`}>
        <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
        No files selected
      </p>
      <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        Choose configuration files to get started
      </p>
    </div>
  );
};

export default EmptyState;