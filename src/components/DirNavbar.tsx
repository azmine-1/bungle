import React from 'react'

interface DirectoryNavbarProps {
  directories: string[];
  activeDirectory: string | null;
  onDirectorySelect: (directory: string) => void;
  isDarkMode: boolean;
}

const DirectoryNavbar: React.FC<DirectoryNavbarProps> = ({ 
  directories, 
  activeDirectory, 
  onDirectorySelect,
  isDarkMode
}) => {
  return (
    <nav className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'} border-b`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap gap-2 sm:gap-0 sm:space-x-6 py-2 sm:py-0">
          {directories.map((directory) => (
            <button
              key={directory}
              onClick={() => onDirectorySelect(directory)}
              className={`py-2 sm:py-3 px-3 sm:px-4 text-sm font-medium transition-colors duration-200 rounded-lg sm:rounded-none ${
                activeDirectory === directory
                  ? isDarkMode
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-blue-600 border-b-2 border-blue-600'
                  : isDarkMode
                    ? 'text-gray-300 hover:text-blue-400 hover:border-b-2 hover:border-gray-500'
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