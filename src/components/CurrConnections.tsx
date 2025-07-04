import { useEffect, useState } from 'react';
import ApiService from '../services/ApiService';

interface ConnectionStatusProps {
  currentConnections: number;
  maxConnections: number;
  isDarkMode: boolean;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  currentConnections: initialConnections,
  maxConnections,
  isDarkMode
}) => {
  const [currentConnections, setCurrentConnections] = useState(initialConnections);

  useEffect(() => {
    const ws = ApiService.createConnectionCountWebSocket(
      (data) => {
        setCurrentConnections(data.count);
      },
      (error) => {
        console.error('Connection count WebSocket error:', error);
      }
    );

    return () => {
      ws.close();
    };
  }, []);

  const percentage = (currentConnections / maxConnections) * 100;

  return (
    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-4 py-2`}>
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Connections: {currentConnections}/{maxConnections}
          </span>
          <div className={`w-full sm:w-32 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            percentage < 50 ? 'bg-green-500' : 
            percentage < 80 ? 'bg-yellow-500' : 'bg-red-500'
          }`}></div>
          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {percentage < 50 ? 'Low' : percentage < 80 ? 'Medium' : 'High'} usage
          </span>
        </div>
      </div>
    </div>
  );
};

export default ConnectionStatus;