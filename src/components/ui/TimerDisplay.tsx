import React from 'react';
import { formatTime } from '../../utils/Formatters';

interface TimerDisplayProps {
  timeRemaining: number;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ timeRemaining }) => {
  const isLowTime = timeRemaining <= 10 * 60; // 10 minutes
  
  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${
      isLowTime 
        ? 'bg-red-900/30 text-red-400 border border-red-500/50' 
        : 'bg-gray-800 text-gray-300'
    } ${isLowTime ? 'animate-pulse' : ''}`}>
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className="text-sm font-mono">
        {formatTime(timeRemaining)}
      </span>
    </div>
  );
};

export default TimerDisplay; 