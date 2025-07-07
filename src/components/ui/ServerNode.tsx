import React from 'react';

interface ServerNodeProps {
  location: string;
  protocol: string;
  directory: string;
}

const ServerNode: React.FC<ServerNodeProps> = ({ location, protocol }) => (
  <div className="flex flex-col items-center flex-shrink-0">
    <div className="w-12 h-12 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center">
      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
      </svg>
    </div>
    <div className="mt-2 text-center">
      <div className="text-xs text-gray-300 font-medium">{location}</div>
      <div className="text-xs text-gray-500">{protocol.toUpperCase()}</div>
    </div>
  </div>
);

export default ServerNode; 