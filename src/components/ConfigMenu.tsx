import React from 'react';

interface ConfigFile {
  name: string;
  protocol: string;
  directory: string;
}

interface ConfigMenuProps {
  selectedFiles: ConfigFile[];
  onRemoveFile: (file: ConfigFile) => void;
  onConnect: () => void;
  onCancel: () => void;
  onApi: () => void;
}

const ConfigMenu: React.FC<ConfigMenuProps> = ({
  selectedFiles,
  onRemoveFile,
  onConnect,
  onCancel,
  onApi,
}) => {
  return (
    <div className="w-96 bg-white shadow-lg rounded-lg m-6 border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Selected Config Files</h2>
        <p className="text-sm text-gray-500 mt-1">Select files to configure your connection</p>
      </div>
      
      <div className="p-4">
        {selectedFiles.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No files selected</p>
            <p className="text-sm text-gray-400 mt-2">Click on files in the list to add them</p>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-6">
              {selectedFiles.map((file, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{file.name}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {file.protocol}/{file.directory}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemoveFile(file)}
                    className="ml-3 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200"
                    title="Remove file"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            
            <div className="space-y-3">
              <button
                onClick={onConnect}
                className="w-full bg-blue-500 text-white py-2.5 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Connect
              </button>
              <button
                onClick={onCancel}
                className="w-full bg-gray-100 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </button>
              <button
                onClick={onApi}
                className="w-full bg-green-500 text-white py-2.5 px-4 rounded-lg hover:bg-green-600 transition-colors duration-200 font-medium flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                API
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ConfigMenu; 