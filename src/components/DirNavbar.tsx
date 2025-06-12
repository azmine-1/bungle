import React from 'react'

interface DirectoryNavbarProps {
  directories: string[];
  activeDirectory: string | null;
  onDirectorySelect: (directory: string) => void;
}

const DirectoryNavbar: React.FC<DirectoryNavbarProps> = ({ 
  directories, 
  activeDirectory, 
  onDirectorySelect 
}) => {
  return (
    <nav className="bg-gray-100 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex space-x-6">
          {directories.map((directory) => (
            <button
              key={directory}
              onClick={() => onDirectorySelect(directory)}
              className={`py-3 px-4 text-sm font-medium transition-colors duration-200 ${
                activeDirectory === directory
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600 hover:border-b-2 hover:border-gray-300'
              }`}
            >
              {directory}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default DirectoryNavbar;