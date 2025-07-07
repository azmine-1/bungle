import React from 'react';
import Button from './Button';

interface CancelButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

const CancelButton: React.FC<CancelButtonProps> = ({
  onClick,
  disabled = false,
  className = ''
}) => {
  return (
    <Button
      onClick={onClick}
      variant="secondary"
      size="small"
      disabled={disabled}
      className={`px-3 sm:px-4 ${className}`}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </Button>
  );
};

export default CancelButton;