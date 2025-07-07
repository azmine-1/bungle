import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success';
  className?: string;
  size?: 'default' | 'small';
  disabled?: boolean;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  children, 
  variant = 'primary',
  className = '',
  size = 'default',
  disabled = false,
  loading = false
}) => {
  const baseStyles = size === 'small' 
    ? "py-2 px-3 rounded-lg transition-all duration-200 font-medium flex items-center justify-center text-sm"
    : "py-2.5 px-4 rounded-lg transition-all duration-200 font-medium flex items-center justify-center";
    
  const variantStyles = {
    primary: disabled || loading 
      ? "bg-gray-400 text-gray-200 cursor-not-allowed" 
      : "bg-blue-500 text-white hover:bg-blue-600 hover:shadow-md",
    secondary: disabled || loading
      ? "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-600 dark:text-gray-500"
      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600",
    success: disabled || loading
      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
      : "bg-emerald-500 text-white hover:bg-emerald-600 hover:shadow-md"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;