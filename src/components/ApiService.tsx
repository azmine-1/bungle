interface FileData {
  [protocolName: string]: {
    [directoryName: string]: {
      files: string[];
      max_conn: number;
      curr_conn: number;
    };
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
            "canada.ovpn",
            "usa.ovpn",
            "uk.ovpn",
            "germany.ovpn",
            "japan.ovpn",
            "australia.ovpn",
            "france.ovpn",
            "netherlands.ovpn"
          ],
          max_conn: 20,
          curr_conn: 7
        },
        "pia": {
          files: [
            "us-east.ovpn",
            "us-west.ovpn",
            "ca-toronto.ovpn",
            "uk-london.ovpn",
            "de-frankfurt.ovpn",
            "jp-tokyo.ovpn",
            "au-sydney.ovpn",
            "fr-paris.ovpn"
          ],
          max_conn: 20,
          curr_conn: 7
        },
        "protonvpn": {
          files: [
            "ca-toronto.ovpn",
            "us-newyork.ovpn",
            "uk-london.ovpn",
            "de-berlin.ovpn",
            "jp-tokyo.ovpn",
            "au-sydney.ovpn",
            "fr-paris.ovpn",
            "nl-amsterdam.ovpn"
          ],
          max_conn: 20,
          curr_conn: 7
        }
      },
      "wg": {
        "nordvpn": {
          files: [
            "canada.conf",
            "usa.conf",
            "uk.conf",
            "germany.conf",
            "japan.conf",
            "australia.conf",
            "france.conf",
            "netherlands.conf"
          ],
          max_conn: 20,
          curr_conn: 7
        },
        "pia": {
          files: [
            "us-east.conf",
            "us-west.conf",
            "ca-toronto.conf",
            "uk-london.conf",
            "de-frankfurt.conf",
            "jp-tokyo.conf",
            "au-sydney.conf",
            "fr-paris.conf"
          ],
          max_conn: 20,
          curr_conn: 7
        },
        "mullvad": {
          files: [
            "ca-toronto.conf",
            "us-newyork.conf",
            "uk-london.conf",
            "de-berlin.conf",
            "jp-tokyo.conf",
            "au-sydney.conf",
            "fr-paris.conf",
            "nl-amsterdam.conf"
          ],
          max_conn: 20,
          curr_conn: 7
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
            "tor1.config",
            "sfo3.config"
          ],
          max_conn: 20,
          curr_conn: 7
        },
        "linode": {
          files: [
            "newark.config",
            "frankfurt.config",
            "singapore.config",
            "london.config",
            "tokyo.config",
            "sydney.config",
            "toronto.config",
            "mumbai.config"
          ],
          max_conn: 20,
          curr_conn: 7
        },
        "vultr": {
          files: [
            "ewr.config",
            "fra.config",
            "sgp.config",
            "lon.config",
            "tyo.config",
            "syd.config",
            "yyz.config",
            "bom.config"
          ],
          max_conn: 20,
          curr_conn: 7
        }
      },
      "socks5": {
        "nordvpn": {
          files: [
            "ca-toronto.socks",
            "us-newyork.socks",
            "uk-london.socks",
            "de-berlin.socks",
            "jp-tokyo.socks",
            "au-sydney.socks",
            "fr-paris.socks",
            "nl-amsterdam.socks"
          ],
          max_conn: 20,
          curr_conn: 7
        },
        "pia": {
          files: [
            "us-east.socks",
            "us-west.socks",
            "ca-toronto.socks",
            "uk-london.socks",
            "de-frankfurt.socks",
            "jp-tokyo.socks",
            "au-sydney.socks",
            "fr-paris.socks"
          ],
          max_conn: 20,
          curr_conn: 7
        },
        "protonvpn": {
          files: [
            "ca-toronto.socks",
            "us-newyork.socks",
            "uk-london.socks",
            "de-berlin.socks",
            "jp-tokyo.socks",
            "au-sydney.socks",
            "fr-paris.socks",
            "nl-amsterdam.socks"
          ],
          max_conn: 20,
          curr_conn: 7
        }
      }
    };
  }
}

export default ApiService;