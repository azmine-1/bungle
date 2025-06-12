interface ConnectionStatusProps {
  currentConnections: number;
  maxConnections: number;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ 
  currentConnections, 
  maxConnections 
}) => {
  const percentage = (currentConnections / maxConnections) * 100;
  
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Connections: {currentConnections}/{maxConnections}
          </span>
          <div className="w-32 bg-gray-200 rounded-full h-2">
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
          <span className="text-sm text-gray-600">
            {percentage < 50 ? 'Low' : percentage < 80 ? 'Medium' : 'High'} usage
          </span>
        </div>
      </div>
    </div>
  );
};


export default ConnectionStatus;