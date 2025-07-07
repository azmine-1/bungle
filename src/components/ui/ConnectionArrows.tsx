import React from 'react';

export const ConnectionArrow: React.FC = () => (
  <div className="flex items-center flex-shrink-0">
    <svg className="w-6 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 12">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 6h16m0 0l-4-4m4 4l-4 4" />
    </svg>
  </div>
);

export const FinalArrow: React.FC = () => (
  <div className="flex items-center flex-shrink-0">
    <svg className="w-6 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 12">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 6h16m0 0l-4-4m4 4l-4 4" />
    </svg>
  </div>
); 