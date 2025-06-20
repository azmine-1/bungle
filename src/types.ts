export interface DirectoryData {
  files: string[];
  conn_count: number;
  max_conn: number;
}

export interface ProtocolData {
  [directoryName: string]: DirectoryData;
}

export interface FileData {
  [protocolName: string]: {
    [directoryName: string]: DirectoryData;
  };
}

export interface ConfigFile {
  name: string;
  protocol: string;
  directory: string;
}

// API Response type (what comes from the server)
export interface ApiResponse {
  [protocolName: string]: {
    [directoryName: string]: {
      files: string[];
      max_conn: number;
      curr_conn: number;
    };
  };
} 