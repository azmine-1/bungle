interface DirectoryData {
  files: string[];
  conn_count: number;
  max_conn: number;
}

interface FileData {
  [protocolName: string]: {
    [directoryName: string]: DirectoryData;
  };
}

export class ApiService {
  private static readonly BASE_URL = 'your-api-endpoint-here';

  static async fetchFileData(): Promise<FileData> {
    try {
      // Replace this mock with your actual API call
      const response = await fetch(`${this.BASE_URL}/files`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      // For now, return mock data if API fails
      return this.getMockData();
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