import React from 'react';

interface ErrorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  errorMessage: string;
  isDarkMode: boolean;
}

const ErrorDialog: React.FC<ErrorDialogProps> = ({
  isOpen,
  onClose,
  errorMessage,
  isDarkMode
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className={`bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 max-w-xs w-full border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}> 
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01" />
          </svg>
          <span className="font-semibold text-red-600 dark:text-red-400">Error</span>
        </div>
        <div className="mb-4 text-gray-700 dark:text-gray-200 text-sm break-words">
          {errorMessage}
        </div>
        <button
          className="w-full mt-2 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ErrorDialog;