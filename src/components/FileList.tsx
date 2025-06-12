import React from 'react'

interface FileListProps {
  files: string[];
  protocolName: string;
  directoryName: string;
  searchTerm: string;
  onFileSelect: (fileName: string) => void;
}

const FileList: React.FC<FileListProps> = ({ 
  files, 
  protocolName, 
  directoryName, 
  searchTerm,
  onFileSelect
}) => {
  const getFileIcon = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'html':
        return '📄';
      case 'css':
        return '🎨';
      case 'js':
        return '⚡';
      case 'png':
      case 'jpg':
      case 'ico':
        return '🖼️';
      case 'md':
        return '📝';
      case 'txt':
        return '📄';
      case 'pdf':
        return '📕';
      case 'zip':
      case 'tar.gz':
        return '📦';
      case 'json':
        return '⚙️';
      case 'pem':
        return '🔐';
      case 'bak':
        return '💾';
      default:
        return '📁';
    }
  };

  // Filter files in the current directory based on search term
  const filteredFiles = searchTerm.trim() 
    ? files.filter(file => 
        file.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : files;

  if (filteredFiles.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {searchTerm ? `No files found matching "${searchTerm}" in ${directoryName}` : 'No files found in this directory'}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {searchTerm ? (
          <>
            Files matching "{searchTerm}" in {protocolName}/{directoryName} 
            <span className="text-sm font-normal text-gray-600 ml-2">
              ({filteredFiles.length} of {files.length} files)
            </span>
          </>
        ) : (
          `Files in ${protocolName}/${directoryName}`
        )}
      </h3>
      
      <div className="space-y-2">
        {filteredFiles.map((file, index) => (
          <div
            key={index}
            onClick={() => onFileSelect(file)}
            className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer"
          >
            <span className="text-xl">{getFileIcon(file)}</span>
            <span className="text-gray-800 font-medium">{file}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileList;