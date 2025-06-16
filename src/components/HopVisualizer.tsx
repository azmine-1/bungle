import React from 'react';
import { FileData } from '../services/VpnFileService';

interface HopVisualizerProps {
  selectedFiles: {
    name: string;
    protocol: string;
    directory: string;
  }[];
  fileData: FileData | null;
}

const HopVisualizer: React.FC<HopVisualizerProps> = ({ selectedFiles, fileData }) => {
  if (selectedFiles.length === 0 || !fileData) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 bg-white border-b border-gray-200">
      <div className="flex items-center justify-center space-x-4">
        {selectedFiles.map((file, index) => {
          // Extract location from filename (e.g., "germany.ovpn" -> "Germany")
          const location = file.name
            .split('.')[0]
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

          // Get connection info for this file's directory
          const directoryData = fileData[file.protocol]?.[file.directory];
          const connectionInfo = directoryData ? `${directoryData.curr_conn}/${directoryData.max_conn}` : 'N/A';

          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-blue-50 rounded-full border-2 border-blue-500 flex items-center justify-center">
                  <span className="text-blue-700 font-medium text-center px-2">{location}</span>
                </div>
                <span className="text-sm text-gray-500 mt-2">{file.protocol}</span>
                <span className="text-xs text-gray-400">Connections: {connectionInfo}</span>
              </div>
              {index < selectedFiles.length - 1 && (
                <div className="flex items-center">
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default HopVisualizer; 