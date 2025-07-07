import React from 'react';

interface DisconnectButtonProps {
  onDisconnect: () => void;
  isDisconnecting: boolean;
}

const DisconnectButton: React.FC<DisconnectButtonProps> = ({ onDisconnect, isDisconnecting }) => (
  <button
    onClick={onDisconnect}
    disabled={isDisconnecting}
    className="inline-flex items-center space-x-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/30 rounded-full px-3 py-1.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {isDisconnecting ? (
      <svg className="w-3 h-3 text-red-400 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    ) : (
      <svg className="w-3 h-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    )}
    <span className="text-red-400 text-xs font-medium">
      {isDisconnecting ? 'Disconnecting...' : 'Disconnect'}
    </span>
  </button>
);

export default DisconnectButton;