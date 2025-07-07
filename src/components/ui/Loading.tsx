import React from 'react'

// Loading Component
const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
    </div>
  );
};

export default Loading; 