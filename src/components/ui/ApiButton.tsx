import React from 'react';
import Button from './Button';

interface ApiButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

const ApiButton: React.FC<ApiButtonProps> = ({
  onClick,
  disabled = false,
  className = ''
}) => {
  return (
    <Button
      onClick={onClick}
      variant="success"
      disabled={disabled}
      className={className}
    >
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 002 2v12a2 2 0 002 2z" />
      </svg>
      <span className="hidden sm:inline">API</span>
      <span className="sm:hidden">API</span>
    </Button>
  );
};

export default ApiButton;