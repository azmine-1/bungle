import { useEffect, useState } from 'react';
import ApiService from '../services/ApiService';
import type { StatusResponse } from '../services/ApiService';

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
  const [connectionStatus, setConnectionStatus] = useState<StatusResponse['state']>('Disconnected');

  useEffect(() => {
    const connCountWs = ApiService.createConnectionCountWebSocket(
      (data) => {
        setCurrentConnections(data.count);
      },
      (error) => {
        console.error('Connection count WebSocket error:', error);
      }
    );

    const fetchStatus = async () => {
      try {
        const statusResponse = await ApiService.getStatus();
        setConnectionStatus(statusResponse.state);
      } catch (err) {
        console.error('Failed to fetch status:', err);
      }
    };

    // Initial fetch
    fetchStatus();

    // Set up polling for status (every 2 seconds)
    const statusInterval = setInterval(fetchStatus, 2000);

    return () => {
      connCountWs.close();
      clearInterval(statusInterval);
    };
  }, []);

  const percentage = (currentConnections / maxConnections) * 100;
  const isConnected = connectionStatus === 'Connected' || connectionStatus === 'ConnectedWithTimer';

  return (
    <div className={`${
      isConnected 
        ? 'bg-green-600/20 border-green-500/50' 
        : isDarkMode 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
    } border-b px-4 py-2 transition-all duration-300`}>
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
            }`}></div>
            <span className={`text-sm font-medium ${
              isConnected 
                ? 'text-green-700 dark:text-green-300' 
                : isDarkMode 
                  ? 'text-gray-300' 
                  : 'text-gray-600'
            }`}>
              {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
            </span>
          </div>
          <span className={`text-sm ${
            isConnected 
              ? 'text-green-700 dark:text-green-300' 
              : isDarkMode 
                ? 'text-gray-300' 
                : 'text-gray-600'
          }`}>
            Connections: {currentConnections}/{maxConnections}
          </span>
          <div className={`w-full sm:w-32 ${
            isConnected 
              ? 'bg-green-200 dark:bg-green-800' 
              : isDarkMode 
                ? 'bg-gray-700' 
                : 'bg-gray-200'
          } rounded-full h-2`}>
            <div
              className={`${
                isConnected ? 'bg-green-500' : 'bg-blue-600'
              } h-2 rounded-full transition-all duration-300`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            percentage < 50 ? 'bg-green-500' : 
            percentage < 80 ? 'bg-yellow-500' : 'bg-red-500'
          }`}></div>
          <span className={`text-sm ${
            isConnected 
              ? 'text-green-700 dark:text-green-300' 
              : isDarkMode 
                ? 'text-gray-300' 
                : 'text-gray-600'
          }`}>
            {percentage < 50 ? 'Low' : percentage < 80 ? 'Medium' : 'High'} usage
          </span>
        </div>
      </div>
    </div>
  );
};

export default ConnectionStatus;