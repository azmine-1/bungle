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
import type { FileData, ConfigFile } from './types';

const App: React.FC = () => {
  const [data, setData] = useState<FileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeProtocol, setActiveProtocol] = useState<string | null>(null);
  const [activeDirectory, setActiveDirectory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<ConfigFile[]>([]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

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
    if (selectedFiles.length === 0) {
      setConnectionError('Please select at least one configuration file');
      return;
    }

    try {
      setIsConnecting(true);
      setConnectionError(null);

      // Check current connection status
      const status = await ApiService.getStatus();
      let filesToConnect = selectedFiles;
      if (status.state === 'Connected' || status.state === 'ConnectedWithTimer') {
        // Parse currently connected files
        const currentFiles = ApiService.parseHopNameList(status.hop_name_list || []);
        // Merge selectedFiles with currentFiles, avoiding duplicates
        const fileKey = (f: ConfigFile) => `${f.name}|${f.protocol}|${f.directory}`;
        const allFilesMap = new Map(currentFiles.map(f => [fileKey(f), f]));
        for (const f of selectedFiles) {
          allFilesMap.set(fileKey(f), f);
        }
        filesToConnect = Array.from(allFilesMap.values());
      }

      // Use ApiService to connect with default timeout of 1 hour (3600 seconds)
      const response = await ApiService.connect(filesToConnect, 3600);

      if (response.success) {
        console.log('Connection successful:', response);
        // Clear selected files after successful connection
        setSelectedFiles([]);
      } else {
        throw Error(typeof response.message === 'string' ? response.message : 'Connection failed');
      }
    } catch (error: unknown) {
      console.error('Failed to connect:', error);
      if (typeof error === 'object' && error !== null && 'message' in error && typeof (error as any).message === 'string') {
        setConnectionError((error as any).message);
      } else if (typeof error === 'string') {
        setConnectionError(error);
      } else {
        setConnectionError('Connection failed');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleCancel = () => {
    setSelectedFiles([]);
    setConnectionError(null);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={typeof error === 'string' ? error : String(error)} onRetry={fetchData} />;
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
      
      {/* HopVisualizer now manages its own state and shows actual connection status */}
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
      
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto">
        <div className="flex-1 order-2 lg:order-1">
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
            <div className={`text-center py-8 px-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              No protocols or directories available
            </div>
          )}
        </div>
        
        <div className="order-1 lg:order-2">
          <ConfigMenu
            selectedFiles={selectedFiles}
            onRemoveFile={handleRemoveFile}
            onConnect={handleConnect}
            onCancel={handleCancel}
            onApi={handleApi}
            isDarkMode={isDarkMode}
            isConnecting={isConnecting}
            connectionError={connectionError}
            errorMessage={error || connectionError}
          />
        </div>
      </div>
    </div>
  );
};

export default App;