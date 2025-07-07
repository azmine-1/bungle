import React from 'react';
import Button from './Button';

interface ConnectButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

const ConnectButton: React.FC<ConnectButtonProps> = ({
  onClick,
  disabled = false,
  loading = false,
  className = ''
}) => {
  return (
    <Button
      onClick={onClick}
      variant="primary"
      disabled={disabled}
      loading={loading}
      className={className}
    >
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
      <span className="hidden sm:inline">
        {loading ? 'Connecting...' : 'Connect'}
      </span>
      <span className="sm:hidden">
        {loading ? 'Connecting...' : 'Connect'}
      </span>
    </Button>
  );
};

export default ConnectButton;