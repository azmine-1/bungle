import React from 'react';
import type { ConfigFile } from '../types';

interface ConfigMenuProps {
  selectedFiles: ConfigFile[];
  onRemoveFile: (file: ConfigFile) => void;
  onConnect: () => void;
  onCancel: () => void;
  onApi: () => void;
  isDarkMode: boolean;
  isConnecting?: boolean;
  connectionError?: string | null;
}

// Button component for consistent styling
const Button = ({ 
  onClick, 
  children, 
  variant = 'primary',
  className = '',
  size = 'default',
  disabled = false,
  loading = false
}: { 
  onClick: () => void; 
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success';
  className?: string;
  size?: 'default' | 'small';
  disabled?: boolean;
  loading?: boolean;
}) => {
  const baseStyles = size === 'small' 
    ? "py-2 px-3 rounded-lg transition-all duration-200 font-medium flex items-center justify-center text-sm"
    : "py-2.5 px-4 rounded-lg transition-all duration-200 font-medium flex items-center justify-center";
    
  const variantStyles = {
    primary: disabled || loading 
      ? "bg-gray-400 text-gray-200 cursor-not-allowed" 
      : "bg-blue-500 text-white hover:bg-blue-600 hover:shadow-md",
    secondary: disabled || loading
      ? "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-600 dark:text-gray-500"
      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600",
    success: disabled || loading
      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
      : "bg-emerald-500 text-white hover:bg-emerald-600 hover:shadow-md"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};

// File item component
const FileItem = ({ 
  file, 
  onRemove, 
  isDarkMode 
}: { 
  file: ConfigFile; 
  onRemove: () => void;
  isDarkMode: boolean;
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

const ConfigMenu: React.FC<ConfigMenuProps> = ({
  selectedFiles,
  onRemoveFile,
  onConnect,
  onCancel,
  onApi,
  isDarkMode,
  isConnecting = false,
  connectionError = null
}) => {
  return (
    <div className={`w-full sm:w-[420px] ${
      isDarkMode 
        ? 'bg-gray-900/95 border-gray-800/50' 
        : 'bg-white/95 border-gray-200/50'
    } backdrop-blur-sm shadow-2xl rounded-2xl m-2 sm:m-6 border overflow-hidden`}>
      
      {/* Header */}
      <div className={`p-4 sm:p-6 border-b ${isDarkMode ? 'border-gray-800/50' : 'border-gray-200/50'}`}>
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
            isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-500/10 text-blue-600'
          }`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h2 className={`text-lg sm:text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              Selected Hops
            </h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected
            </p>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4 sm:p-6">
        {/* Connection Error Display */}
        {connectionError && (
          <div className={`mb-4 p-3 rounded-lg border ${
            isDarkMode 
              ? 'bg-red-900/20 border-red-800/50 text-red-400' 
              : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">Connection Error</span>
            </div>
            <p className="text-xs mt-1 opacity-90">{connectionError}</p>
          </div>
        )}

        {selectedFiles.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
              isDarkMode ? 'bg-gray-800/50 text-gray-500' : 'bg-gray-100/50 text-gray-400'
            }`}>
              <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
              No files selected
            </p>
            <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Choose configuration files to get started
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-6 sm:mb-8">
              {selectedFiles.map((file, index) => (
                <FileItem
                  key={index}
                  file={file}
                  onRemove={() => onRemoveFile(file)}
                  isDarkMode={isDarkMode}
                />
              ))}
            </div>
            
            {/* Action buttons - side by side */}
            <div className="flex gap-2 sm:gap-3">
              <Button 
                onClick={onConnect} 
                variant="primary" 
                className="flex-1"
                disabled={selectedFiles.length === 0}
                loading={isConnecting}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="hidden sm:inline">
                  {isConnecting ? 'Connecting...' : 'Connect'}
                </span>
                <span className="sm:hidden">
                  {isConnecting ? 'Connecting...' : 'Connect'}
                </span>
              </Button>
              <Button 
                onClick={onApi} 
                variant="success" 
                className="flex-1"
                disabled={isConnecting}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 002 2v12a2 2 0 002 2z" />
                </svg>
                <span className="hidden sm:inline">API</span>
                <span className="sm:hidden">API</span>
              </Button>
              <Button 
                onClick={onCancel} 
                variant="secondary" 
                size="small" 
                className="px-3 sm:px-4"
                disabled={isConnecting}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ConfigMenu;