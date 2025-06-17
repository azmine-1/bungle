import {useEffect, useState} from 'react'
import ProtocolNavbar from './components/ProtoNavbar';
import Loading from './components/Loading';
import Error from './components/Error';
import DirectoryNavbar from './components/DirNavbar';
import ConnectionStatus from './components/CurrConnections';
import FileList from './components/FileList';
import ApiService from './services/ApiService';
import ConfigMenu from './components/ConfigMenu';
import HopVisualizer from './components/HopVisualizer';

interface FileData {
  [protocolName: string]: {
    [directoryName: string]: {
      files: string[];
      conn_count: number;
      max_conn: number;
    };
  };
}

interface ConfigFile {
  name: string;
  protocol: string;
  directory: string;
}

const App: React.FC = () => {
  const [data, setData] = useState<FileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeProtocol, setActiveProtocol] = useState<string | null>(null);
  const [activeDirectory, setActiveDirectory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<ConfigFile[]>([]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await ApiService.fetchFileData();
      setData(result);
      
      // Auto-select first available protocol and directory
      const protocols = Object.keys(result);
      if (protocols.length > 0) {
        const firstProtocol = protocols[0];
        setActiveProtocol(firstProtocol);
        
        const directories = Object.keys(result[firstProtocol]);
        if (directories.length > 0) {
          setActiveDirectory(directories[0]);
        }
      }
    } catch (err) {
      setError('Failed to fetch data from API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleProtocolSelect = (protocol: string) => {
    setActiveProtocol(protocol);
    if (data) {
      const directories = Object.keys(data[protocol]);
      setActiveDirectory(directories.length > 0 ? directories[0] : null);
    }
  };

  const handleDirectorySelect = (directory: string) => {
    setActiveDirectory(directory);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const handleFileSelect = (fileName: string) => {
    if (!activeProtocol || !activeDirectory) return;
    
    const newFile: ConfigFile = {
      name: fileName,
      protocol: activeProtocol,
      directory: activeDirectory
    };
    
    // Check if file is already selected
    const isAlreadySelected = selectedFiles.some(
      file => file.name === fileName && 
              file.protocol === activeProtocol && 
              file.directory === activeDirectory
    );
    
    if (!isAlreadySelected) {
      setSelectedFiles([...selectedFiles, newFile]);
    }
  };

  const handleRemoveFile = (file: ConfigFile) => {
    setSelectedFiles(selectedFiles.filter(f => 
      !(f.name === file.name && 
        f.protocol === file.protocol && 
        f.directory === file.directory)
    ));
  };

  const handleApi = () => {
    // TODO: Implement API functionality
    console.log('API clicked', selectedFiles);
  };

  const handleConnect = async () => {
    try {
      const response = await fetch('/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // TODO: Add payload structure here
          selectedFiles
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Connection response:', result);
      
      // TODO: Handle successful connection
      // For example: show success message, update UI state, etc.
    } catch (error) {
      console.error('Failed to connect:', error);
      // TODO: Handle connection error
      // For example: show error message to user
    }
  };

  const handleCancel = () => {
    setSelectedFiles([]);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={fetchData} />;
  if (!data) return <Error message="No data available" onRetry={fetchData} />;

  const protocols = Object.keys(data);
  const directories = activeProtocol ? Object.keys(data[activeProtocol]) : [];
  const files = activeProtocol && activeDirectory 
    ? data[activeProtocol][activeDirectory].files 
    : [];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <ConnectionStatus 
        currentConnections={activeProtocol && activeDirectory ? data[activeProtocol][activeDirectory].conn_count : 0} 
        maxConnections={activeProtocol && activeDirectory ? data[activeProtocol][activeDirectory].max_conn : 0}
        isDarkMode={isDarkMode}
      />
      
      <HopVisualizer selectedFiles={selectedFiles} fileData={data} />
      
      <ProtocolNavbar
        protocols={protocols}
        activeProtocol={activeProtocol}
        onProtocolSelect={handleProtocolSelect}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />
      
      {activeProtocol && directories.length > 0 && (
        <DirectoryNavbar
          directories={directories}
          activeDirectory={activeDirectory}
          onDirectorySelect={handleDirectorySelect}
          isDarkMode={isDarkMode}
        />
      )}
      
      <div className="flex max-w-7xl mx-auto">
        <div className="flex-1">
          {activeProtocol && activeDirectory && (
            <FileList
              files={files}
              protocolName={activeProtocol}
              directoryName={activeDirectory}
              searchTerm={searchTerm}
              onFileSelect={handleFileSelect}
              isDarkMode={isDarkMode}
            />
          )}
          
          {(!activeProtocol || directories.length === 0) && (
            <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              No protocols or directories available
            </div>
          )}
        </div>
        
        <ConfigMenu
          selectedFiles={selectedFiles}
          onRemoveFile={handleRemoveFile}
          onConnect={handleConnect}
          onCancel={handleCancel}
          onApi={handleApi}
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  );
};

export default App;