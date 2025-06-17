import React from 'react'

interface ProtocolNavbarProps {
  protocols: string[];
  activeProtocol: string | null;
  onProtocolSelect: (protocol: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const ProtocolNavbar: React.FC<ProtocolNavbarProps> = ({ 
  protocols, 
  activeProtocol, 
  onProtocolSelect,
  searchTerm,
  onSearchChange,
  isDarkMode,
  onToggleDarkMode
}) => {
  return (
    <nav className={`${isDarkMode ? 'bg-gray-800' : 'bg-blue-600'} shadow-lg`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex space-x-8">
            {protocols.map((protocol) => (
              <button
                key={protocol}
                onClick={() => onProtocolSelect(protocol)}
                className={`py-4 px-6 text-sm font-medium transition-colors duration-200 ${
                  activeProtocol === protocol
                    ? 'text-white border-b-2 border-white'
                    : isDarkMode 
                      ? 'text-gray-300 hover:text-white hover:border-b-2 hover:border-gray-400'
                      : 'text-blue-100 hover:text-white hover:border-b-2 hover:border-blue-200'
                }`}
              >
                {protocol}
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={onToggleDarkMode}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                isDarkMode 
                  ? 'text-yellow-300 hover:bg-gray-700' 
                  : 'text-gray-300 hover:bg-blue-700'
              }`}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            
            <div className="relative">
              <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className={`w-64 px-4 py-2 pl-10 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent ${
                  isDarkMode 
                    ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400' 
                    : 'bg-white text-gray-900 border-gray-300'
                }`}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {searchTerm && (
                <button
                  onClick={() => onSearchChange('')}
                  className={`absolute inset-y-0 right-0 flex items-center pr-3 ${
                    isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ProtocolNavbar;