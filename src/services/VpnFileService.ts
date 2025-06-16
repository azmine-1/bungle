// Define the TypeScript interfaces
interface DirectoryData {
  files: string[];
  max_conn: number;
  curr_conn: number;
}

interface ProtocolData {
  [directoryName: string]: DirectoryData;
}

interface FileData {
  [protocolName: string]: ProtocolData;
}

// API Response type (what comes from the server)
interface ApiResponse {
  [protocolName: string]: {
    [directoryName: string]: {
      files: string[];
      max_conn: number;
      curr_conn: number;
    };
  };
}

// API Service class
export class VpnFileService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // Fetch and transform the data
  async getFileData(): Promise<FileData> {
    try {
      const response = await fetch(`${this.baseUrl}/listfiles`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const rawData: ApiResponse = await response.json();
      
      // Transform the raw data to match our FileData interface
      const fileData: FileData = this.transformApiResponse(rawData);
      
      return fileData;
    } catch (error) {
      console.error('Error fetching file data:', error);
      throw error;
    }
  }

  // Transform API response to FileData structure
  private transformApiResponse(apiResponse: ApiResponse): FileData {
    const fileData: FileData = {};

    // Iterate through each protocol
    Object.entries(apiResponse).forEach(([protocolName, protocolData]) => {
      fileData[protocolName] = {};

      // Iterate through each directory in the protocol
      Object.entries(protocolData).forEach(([directoryName, directoryData]) => {
        fileData[protocolName][directoryName] = {
          files: directoryData.files,
          max_conn: directoryData.max_conn,
          curr_conn: directoryData.curr_conn
        };
      });
    });

    return fileData;
  }

  // Helper method to get files for a specific protocol and directory
  getFilesForDirectory(fileData: FileData, protocol: string, directory: string): string[] {
    return fileData[protocol]?.[directory]?.files || [];
  }

  // Helper method to get connection info for a directory
  getConnectionInfo(fileData: FileData, protocol: string, directory: string): { curr_conn: number; max_conn: number } | null {
    const directoryData = fileData[protocol]?.[directory];
    if (!directoryData) return null;

    return {
      curr_conn: directoryData.curr_conn,
      max_conn: directoryData.max_conn
    };
  }

  // Helper method to check if directory has available connections
  hasAvailableConnections(fileData: FileData, protocol: string, directory: string): boolean {
    const connInfo = this.getConnectionInfo(fileData, protocol, directory);
    return connInfo ? connInfo.curr_conn < connInfo.max_conn : false;
  }
}

// React Hook for using the VPN file service
import { useState, useEffect } from 'react';

interface UseVpnFilesResult {
  fileData: FileData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useVpnFiles = (baseUrl: string): UseVpnFilesResult => {
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const vpnService = new VpnFileService(baseUrl);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await vpnService.getFileData();
      setFileData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [baseUrl]);

  return {
    fileData,
    loading,
    error,
    refetch: fetchData
  };
};

// Example usage in a React component
export const VpnFileManager: React.FC = () => {
  const { fileData, loading, error, refetch } = useVpnFiles('http://your-api-url');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!fileData) return <div>No data available</div>;

  return (
    <div>
      <h2>VPN Files</h2>
      <button onClick={refetch}>Refresh Data</button>
      
      {Object.entries(fileData).map(([protocolName, protocolData]) => (
        <div key={protocolName}>
          <h3>Protocol: {protocolName}</h3>
          {Object.entries(protocolData).map(([directoryName, directoryData]) => (
            <div key={directoryName} style={{ marginLeft: '20px' }}>
              <h4>Directory: {directoryName}</h4>
              <p>Connections: {directoryData.curr_conn} / {directoryData.max_conn}</p>
              <ul>
                {directoryData.files.map((file, index) => (
                  <li key={index}>{file}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

// Export types for use in other files
export type { FileData, DirectoryData, ProtocolData }; 