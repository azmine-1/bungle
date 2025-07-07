import React from 'react';

interface ErrorIconProps {
  onClick: () => void;
  hasError: boolean;
  disabled?: boolean;
}

const ErrorIcon: React.FC<ErrorIconProps> = ({
  onClick,
  hasError,
  disabled = false
}) => {
  return (
    <button
      className="relative group"
      style={{ outline: 'none' }}
      onClick={onClick}
      title={hasError ? 'Show error' : 'No errors'}
      tabIndex={0}
      aria-label="Show error dialog"
      disabled={disabled}
    >
      <svg
        className={`w-6 h-6 transition-colors duration-200 ${
          hasError 
            ? 'text-red-500 animate-pulse' 
            : 'text-gray-400 opacity-50'
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" strokeWidth="2" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01" />
      </svg>
    </button>
  );
};

export default ErrorIcon;