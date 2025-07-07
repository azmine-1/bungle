import React from 'react';

interface AddTimeButtonProps {
  onAddTime: () => void;
  isLoading: boolean;
}

const AddTimeButton: React.FC<AddTimeButtonProps> = ({ onAddTime, isLoading }) => (
  <button
    onClick={onAddTime}
    disabled={isLoading}
    className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-900/20 text-blue-400 hover:bg-blue-900/30 transition-colors disabled:opacity-50"
  >
    {isLoading ? (
      <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    ) : (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )}
    <span className="text-sm font-medium">
      {isLoading ? 'Adding...' : '+1 Hour'}
    </span>
  </button>
);

export default AddTimeButton;