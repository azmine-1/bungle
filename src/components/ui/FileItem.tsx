import React from 'react';
import type { ConfigFile } from '../types';

interface FileItemProps {
  file: ConfigFile;
  onRemove: () => void;
  isDarkMode: boolean;
}

const FileItem: React.FC<FileItemProps> = ({ 
  file, 
  onRemove, 
  isDarkMode 
}) => (
  <div 
    className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-200 hover:scale-[1.02] ${
      isDarkMode 
        ? 'bg-gray-800/50 border-gray-700/50 hover:border-gray-600 hover:bg-gray-800' 
        : 'bg-gray-50/50 border-gray-200/50 hover:border-gray-300 hover:bg-white hover:shadow-sm'
    }`}
  >
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-blue-400' : 'bg-blue-500'}`} />
        <div className="min-w-0 flex-1">
          <p className={`font-medium truncate ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            {file.name}
          </p>
          <p className={`text-sm truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-0.5`}>
            {file.protocol}/{file.directory}
          </p>
        </div>
      </div>
    </div>
    <button
      onClick={onRemove}
      className={`ml-3 p-2 opacity-0 group-hover:opacity-100 ${
        isDarkMode 
          ? 'text-gray-500 hover:text-red-400 hover:bg-gray-700' 
          : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
      } rounded-lg transition-all duration-200`}
      title="Remove file"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
);

export default FileItem;