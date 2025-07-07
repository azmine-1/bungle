import React from 'react';
import type { ConfigFile } from '../types';
import ConnectButton from './ui/ConnectButton';
import ApiButton from './ui/ApiButton';
import CancelButton from './ui/CancelButton';
import FileItem from './ui/FileItem';
import ErrorDialog from './ui/ErrorDialog';
import ErrorIcon from './ui/ErrorIcon';
import ConnectionError from './ui/ConnectionError';
import EmptyState from './ui/EmptyState';

interface ConfigMenuProps {
  selectedFiles: ConfigFile[];
  onRemoveFile: (file: ConfigFile) => void;
  onConnect: () => void;
  onCancel: () => void;
  onApi: () => void;
  isDarkMode: boolean;
  isConnecting?: boolean;
  connectionError?: string | null;
  errorMessage?: string | null;
}

const ConfigMenu: React.FC<ConfigMenuProps> = ({
  selectedFiles,
  onRemoveFile,
  onConnect,
  onCancel,
  onApi,
  isDarkMode,
  isConnecting = false,
  connectionError = null,
  errorMessage = null
}) => {
  const [showErrorDialog, setShowErrorDialog] = React.useState(false);

  return (
    <div className={`w-full sm:w-[420px] ${
      isDarkMode 
        ? 'bg-gray-900/95 border-gray-800/50' 
        : 'bg-white/95 border-gray-200/50'
    } backdrop-blur-sm shadow-2xl rounded-2xl m-2 sm:m-6 border overflow-hidden`}>
      
      {/* Header */}
      <div className={`p-4 sm:p-6 border-b ${isDarkMode ? 'border-gray-800/50' : 'border-gray-200/50'}`}>
        <div className="flex items-center gap-3 justify-between">
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
          
          <ErrorIcon
            onClick={() => errorMessage && setShowErrorDialog(true)}
            hasError={!!errorMessage}
            disabled={!errorMessage}
          />
        </div>
      </div>
      
      {/* Error Dialog Modal */}
      <ErrorDialog
        isOpen={showErrorDialog}
        onClose={() => setShowErrorDialog(false)}
        errorMessage={errorMessage || ''}
        isDarkMode={isDarkMode}
      />

      {/* Content */}
      <div className="p-4 sm:p-6">
        {/* Connection Error Display */}
        {connectionError && (
          <ConnectionError
            message={connectionError}
            isDarkMode={isDarkMode}
          />
        )}

        {selectedFiles.length === 0 ? (
          <EmptyState isDarkMode={isDarkMode} />
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
              <ConnectButton
                onClick={onConnect}
                disabled={selectedFiles.length === 0}
                loading={isConnecting}
                className="flex-1"
              />
              <ApiButton
                onClick={onApi}
                disabled={isConnecting}
                className="flex-1"
              />
              <CancelButton
                onClick={onCancel}
                disabled={isConnecting}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ConfigMenu;