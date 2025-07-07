import type { FileData, ConfigFile } from '../types';

// Add new types for the API responses
export interface StatusResponse {
  state: "Disconnected" | "ConnectionInProgress" | "Connected" | "ConnectedWithTimer";
  hop_list: string[]; // e.g: ["OpenVPN", "Wireguard", "OpenVPN"]
  hop_name_list: string[]; // e.g: "bahamas.ovpn[PIA_NPT]"
  remote_ip_list: string[];
  time: string;
}

export interface ConnectPayload {
  routes: {
    name: string;
    directory: string;
    type: string;
  }[];
  timeout: number;
}

export interface ConnectResponse {
  success: boolean;
  message?: string;
  // Add other fields as needed based on your API response
}

export interface ConnectionCountResponse {
  count: number;
}

export interface TimeoutResponse {
  seconds_remaining: number;
}

export interface TimeoutUpdateResponse {
  success: boolean;
  message?: string;
  new_timeout?: number;
}

export class ApiService {
  private static readonly BASE_URL = 'http://localhost:8000';
  private static readonly WS_URL = 'ws://localhost:8000';

  /**
   * Fetch file data from /listfiles endpoint
   */
  static async fetchFileData(): Promise<FileData> {
    try {
      const response = await fetch(`${this.BASE_URL}/list_files`);
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch {
          if (errorText) {
            errorMessage = errorText;
          }
        }
        throw new Error(errorMessage);
      }
      return await response.json();
    } catch (error) {
      console.warn('API call failed, using mock data:', error);
      // For now, return mock data if API fails
      return this.getMockData();
    }
  }

  /**
   * Get connection status from /status endpoint
   */
  static async getStatus(): Promise<StatusResponse> {
    try {
      const response = await fetch(`${this.BASE_URL}/status`);
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch {
          if (errorText) {
            errorMessage = errorText;
          }
        }
        throw new Error(errorMessage);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch status:', error);
      throw error;
    }
  }

  /**
   * Connect using selected files via /connect endpoint
   */
  static async connect(selectedFiles: ConfigFile[], timeout: number = 3600): Promise<ConnectResponse> {
    try {
      const routes = selectedFiles.map(file => ({
        name: file.name,
        directory: file.directory,
        type: file.protocol
      }));

      const payload: ConnectPayload = {
        routes,
        timeout
      };

      console.log('Sending connect request:', JSON.stringify(payload, null, 2));

      const response = await fetch(`${this.BASE_URL}/connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const responseData = await response.json();

      if (!response.ok) {
        let errorMessage = `Connection failed with status: ${response.status}`;
        if (responseData.message) {
          errorMessage = responseData.message;
        }
        throw new Error(errorMessage);
      }

      // Check if the API returned unsuccessful status
      if (!responseData.success && responseData.message) {
        throw new Error(responseData.message);
      }

      return responseData;
    } catch (error) {
      console.error('Failed to connect:', error);
      throw error;
    }
  }

  /**
   * Disconnect from current connection
   * Assuming there's a disconnect endpoint - adjust as needed
   */
  static async disconnect(): Promise<void> {
    try {
      const response = await fetch(`${this.BASE_URL}/disconnect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Disconnect failed with status: ${response.status}`;
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch {
          if (errorText) {
            errorMessage = errorText;
          }
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Failed to disconnect:', error);
      throw error;
    }
  }

  /**
   * Get current connection timeout remaining in seconds
   */
  static async getTimeout(): Promise<TimeoutResponse> {
    try {
      const response = await fetch(`${this.BASE_URL}/timeout`);
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch {
          if (errorText) {
            errorMessage = errorText;
          }
        }
        throw new Error(errorMessage);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch timeout:', error);
      throw error;
    }
  }

  /**
   * Add time to current connection timeout
   * @param time - Time in seconds to add (defaults to 3600 for 1 hour)
   */
  static async addTimeout(time: number = 3600): Promise<TimeoutUpdateResponse> {
    try {
      const response = await fetch(`${this.BASE_URL}/timeout/${time}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const responseData = await response.json();

      if (!response.ok) {
        let errorMessage = `Timeout update failed with status: ${response.status}`;
        if (responseData.message) {
          errorMessage = responseData.message;
        }
        throw new Error(errorMessage);
      }

      // Check if the API returned unsuccessful status
      if (!responseData.success && responseData.message) {
        throw new Error(responseData.message);
      }

      return responseData;
    } catch (error) {
      console.error('Failed to update timeout:', error);
      throw error;
    }
  }

  /**
   * Create WebSocket connection for real-time connection count updates
   * @param onMessage - Callback function to handle incoming messages
   * @param onError - Optional error handler
   * @param onClose - Optional close handler
   */
  static createConnectionCountWebSocket(
    onMessage: (data: ConnectionCountResponse) => void,
    onError?: (error: Event) => void,
    onClose?: (event: CloseEvent) => void
  ): WebSocket {
    const ws = new WebSocket(`${this.WS_URL}/ws/conn_count`);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket connection count error:', error);
      if (onError) onError(error);
    };

    ws.onclose = (event) => {
      console.log('WebSocket connection count closed:', event);
      if (onClose) onClose(event);
    };

    return ws;
  }

  /**
   * Create WebSocket connection for real-time status updates
   * @param onMessage - Callback function to handle incoming messages
   * @param onError - Optional error handler
   * @param onClose - Optional close handler
   */
  static createStatusWebSocket(
    onMessage: (data: StatusResponse) => void,
    onError?: (error: Event) => void,
    onClose?: (event: CloseEvent) => void
  ): WebSocket {
    const ws = new WebSocket(`${this.WS_URL}/ws/status`);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket status error:', error);
      if (onError) onError(error);
    };

    ws.onclose = (event) => {
      console.log('WebSocket status closed:', event);
      if (onClose) onClose(event);
    };

    return ws;
  }

  /**
   * Parse hop_name_list into ConfigFile format for the visualizer
   */
  static parseHopNameList(hopNameList: string[]): ConfigFile[] {
    return hopNameList.map(hopName => {
      // Parse format like "bahamas.ovpn[PIA_NPT]"
      const match = hopName.match(/^(.+?)\[(.+?)_(.+?)\]$/);
      if (match) {
        const [, fileName, directory, protocol] = match;
        return {
          name: fileName,
          directory: directory.toLowerCase(),
          protocol: protocol.toLowerCase()
        };
      }
      
      // Fallback parsing if format is different
      console.warn('Unexpected hop name format:', hopName);
      return {
        name: hopName,
        directory: 'unknown',
        protocol: 'unknown'
      };
    });
  }

  /**
   * Map backend connection states to frontend states
   */
  static mapConnectionState(backendState: StatusResponse['state']): 'idle' | 'connecting' | 'success' | 'failed' {
    switch (backendState) {
      case 'Disconnected':
        return 'idle';
      case 'ConnectionInProgress':
        return 'connecting';
      case 'Connected':
      case 'ConnectedWithTimer':
        return 'success';
      default:
        return 'failed';
    }
  }

  private static getMockData(): FileData {
    return {
      "ovpn": {
        "nordvpn": {
          files: [
            "us-newyork.ovpn",
            "us-losangeles.ovpn",
            "uk-london.ovpn",
            "de-frankfurt.ovpn",
            "fr-paris.ovpn",
            "jp-tokyo.ovpn",
            "sg-singapore.ovpn",
            "ca-toronto.ovpn",
            "au-sydney.ovpn",
            "nl-amsterdam.ovpn"
          ],
          conn_count: 7,
          max_conn: 20
        },
        "pia": {
          files: [
            "us-east.ovpn",
            "us-west.ovpn",
            "uk-london.ovpn",
            "de-frankfurt.ovpn",
            "fr-paris.ovpn"
          ],
          conn_count: 7,
          max_conn: 20
        },
        "protonvpn": {
          files: [
            "us-newyork.ovpn",
            "us-losangeles.ovpn",
            "uk-london.ovpn",
            "de-frankfurt.ovpn",
            "fr-paris.ovpn",
            "jp-tokyo.ovpn",
            "nl-amsterdam.ovpn"
          ],
          conn_count: 7,
          max_conn: 20
        }
      },
      "wg": {
        "nordvpn": {
          files: [
            "us-newyork.conf",
            "us-losangeles.conf",
            "uk-london.conf",
            "de-frankfurt.conf",
            "fr-paris.conf",
            "jp-tokyo.conf",
            "sg-singapore.conf",
            "ca-toronto.conf",
            "au-sydney.conf",
            "netherlands.conf"
          ],
          conn_count: 7,
          max_conn: 20
        },
        "pia": {
          files: [
            "us-east.conf",
            "us-west.conf",
            "uk-london.conf",
            "de-frankfurt.conf",
            "fr-paris.conf"
          ],
          conn_count: 7,
          max_conn: 20
        },
        "mullvad": {
          files: [
            "us-newyork.conf",
            "us-losangeles.conf",
            "uk-london.conf",
            "de-frankfurt.conf",
            "fr-paris.conf",
            "jp-tokyo.conf",
            "nl-amsterdam.conf"
          ],
          conn_count: 7,
          max_conn: 20
        }
      },
      "ssh": {
        "digitalocean": {
          files: [
            "nyc1.config",
            "nyc3.config",
            "ams3.config",
            "sgp1.config",
            "lon1.config",
            "fra1.config",
            "sfo3.config"
          ],
          conn_count: 7,
          max_conn: 20
        },
        "linode": {
          files: [
            "newark.config",
            "frankfurt.config",
            "singapore.config",
            "tokyo.config",
            "mumbai.config"
          ],
          conn_count: 7,
          max_conn: 20
        },
        "vultr": {
          files: [
            "ewr.config",
            "fra.config",
            "sgp.config",
            "tyo.config",
            "bom.config"
          ],
          conn_count: 7,
          max_conn: 20
        }
      },
      "socks": {
        "nordvpn": {
          files: [
            "us-newyork.socks",
            "us-losangeles.socks",
            "uk-london.socks",
            "de-frankfurt.socks",
            "fr-paris.socks",
            "jp-tokyo.socks",
            "sg-singapore.socks",
            "ca-toronto.socks",
            "au-sydney.socks",
            "nl-amsterdam.socks"
          ],
          conn_count: 7,
          max_conn: 20
        },
        "pia": {
          files: [
            "us-east.socks",
            "us-west.socks",
            "uk-london.socks",
            "de-frankfurt.socks",
            "fr-paris.socks"
          ],
          conn_count: 7,
          max_conn: 20
        },
        "protonvpn": {
          files: [
            "us-newyork.socks",
            "us-losangeles.socks",
            "uk-london.socks",
            "de-frankfurt.socks",
            "fr-paris.socks",
            "jp-tokyo.socks",
            "nl-amsterdam.socks"
          ],
          conn_count: 7,
          max_conn: 20
        }
      }
    };
  }
}

export default ApiService;