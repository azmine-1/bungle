import React from 'react'

interface ProtocolNavbarProps {
  protocols: string[];
  activeProtocol: string | null;
  onProtocolSelect: (protocol: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const ProtocolNavbar: React.FC<ProtocolNavbarProps> = ({ 
  protocols, 
  activeProtocol, 
  onProtocolSelect,
  searchTerm,
  onSearchChange
}) => {
  return (
    <nav className="bg-blue-600 shadow-lg">
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
                    : 'text-blue-100 hover:text-white hover:border-b-2 hover:border-blue-200'
                }`}
              >
                {protocol}
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-64 px-4 py-2 pl-10 text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {searchTerm && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
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