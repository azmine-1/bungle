import React from 'react';

interface DeviceIconProps {
  type: 'user' | 'internet';
}

const DeviceIcon: React.FC<DeviceIconProps> = ({ type }) => (
  <div className="flex flex-col items-center flex-shrink-0">
    <div className={`w-10 h-10 ${type === 'user' ? 'bg-gray-800 border-gray-700' : 'bg-green-900 border-green-700'} border rounded-lg flex items-center justify-center`}>
      <svg className={`w-5 h-5 ${type === 'user' ? 'text-gray-400' : 'text-green-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {type === 'user' ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        )}
      </svg>
    </div>
    <span className="text-xs text-gray-400 mt-1">{type === 'user' ? 'You' : 'Internet'}</span>
  </div>
);

export default DeviceIcon; 