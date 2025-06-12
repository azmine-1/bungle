import {useEffect, useState} from 'react'
import ProtocolNavbar from './components/ProtoNavbar';
import Loading from './components/Loading';
import Error from './components/Error';
import DirectoryNavbar from './components/DirNavbar';
import ConnectionStatus from './components/CurrConnections';
import FileList from './components/FileList';
import ApiService from './components/ApiService';
import ConfigMenu from './components/ConfigMenu';

interface FileData {
  protocol: {
    [key: string]: {
      directory: {
        [key: string]: {
          files: string[];
        };
      };
    };
  };
  curr_conn: number;
  max_conn: number;
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

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await ApiService.fetchFileData();
      setData(result);
      
      // Auto-select first available protocol and directory
      const protocols = Object.keys(result.protocol);
      if (protocols.length > 0) {
        const firstProtocol = protocols[0];
        setActiveProtocol(firstProtocol);
        
        const directories = Object.keys(result.protocol[firstProtocol].directory);
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
      const directories = Object.keys(data.protocol[protocol].directory);
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

  const handleConnect = () => {
    // TODO: Implement connect functionality
    console.log('Connect clicked', selectedFiles);
  };

  const handleCancel = () => {
    setSelectedFiles([]);
  };

  const handleApi = () => {
    // TODO: Implement API functionality
    console.log('API clicked', selectedFiles);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={fetchData} />;
  if (!data) return <Error message="No data available" onRetry={fetchData} />;

  const protocols = Object.keys(data.protocol);
  const directories = activeProtocol ? Object.keys(data.protocol[activeProtocol].directory) : [];
  const files = activeProtocol && activeDirectory 
    ? data.protocol[activeProtocol].directory[activeDirectory].files 
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <ConnectionStatus 
        currentConnections={data.curr_conn} 
        maxConnections={data.max_conn} 
      />
      
      <ProtocolNavbar
        protocols={protocols}
        activeProtocol={activeProtocol}
        onProtocolSelect={handleProtocolSelect}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />
      
      {activeProtocol && directories.length > 0 && (
        <DirectoryNavbar
          directories={directories}
          activeDirectory={activeDirectory}
          onDirectorySelect={handleDirectorySelect}
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
            />
          )}
          
          {(!activeProtocol || directories.length === 0) && (
            <div className="text-center py-8 text-gray-500">
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
        />
      </div>
    </div>
  );
};

export default App;