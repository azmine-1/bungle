import React, { useState, useEffect } from 'react';
import ApiService from '../services/ApiService';
import type { StatusResponse } from '../services/ApiService';
import type { FileData, ConfigFile } from '../types';

// Import components
import DisconnectButton from './ui/DisconnectButton';
import TimerDisplay from './ui/TimerDisplay';
import AddTimeButton from './ui/AddTimeButton';
import ServerNode from './ui/ServerNode';
import { ConnectionArrow, FinalArrow } from './ui/ConnectionArrows';
import DeviceIcon from './ui/DeviceIcon';
import { formatLocation } from '../utils/Formatters';

interface HopVisualizerProps {
  selectedFiles: ConfigFile[];
  fileData: FileData | null;
}

const HopVisualizer: React.FC<HopVisualizerProps> = () => {
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [isAddingTime, setIsAddingTime] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch status and timeout on component mount and set up polling
  useEffect(() => {

    const fetchStatus = async () => {
      try {
        const statusResponse = await ApiService.getStatus();
        setStatus(statusResponse);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch status:', err);
        setError('Failed to fetch connection status');
      }
    };

    const fetchTimeout = async () => {
      try {
        if (status?.state === 'Connected' || status?.state === 'ConnectedWithTimer') {
          const timeoutResponse = await ApiService.getTimeout();
          setTimeRemaining(timeoutResponse.seconds_remaining);
        }
      } catch (err) {
        console.error('Failed to fetch timeout:', err);
      }
    };

    // Initial fetch
    fetchStatus();
    fetchTimeout();

    // Set up polling for status (every 2 seconds)
    const statusInterval = setInterval(fetchStatus, 2000);

    // Set up polling for timeout (every second when connected)
    const timeoutInterval = setInterval(() => {
      if (status?.state === 'Connected' || status?.state === 'ConnectedWithTimer') {
        fetchTimeout();
      }
    }, 1000);

    return () => {
      clearInterval(statusInterval);
      clearInterval(timeoutInterval);
    };
  }, [status?.state]);

  const handleDisconnect = async () => {
    try {
      setIsDisconnecting(true);
      setError(null);
      await ApiService.disconnect();
      
      // Refresh status after disconnect
      const statusResponse = await ApiService.getStatus();
      setStatus(statusResponse);
      setTimeRemaining(0);
    } catch (err) {
      console.error('Failed to disconnect:', err);
      setError('Failed to disconnect');
    } finally {
      setIsDisconnecting(false);
    }
  };

  const handleAddTime = async () => {
    try {
      setIsAddingTime(true);
      setError(null);
      await ApiService.addTimeout(3600); // Add 1 hour (3600 seconds)
      
      // Refresh timeout after adding time
      const timeoutResponse = await ApiService.getTimeout();
      setTimeRemaining(timeoutResponse.seconds_remaining);
    } catch (err) {
      console.error('Failed to add time:', err);
      if (typeof err === 'object' && err !== null && 'message' in err && typeof (err as Error).message === 'string') {
        setError((err as Error).message);
      } else if (typeof err === 'string') {
        setError(err);
      } else {
        setError('Failed to add time');
      }
    } finally {
      setIsAddingTime(false);
    }
  };

  // Don't show visualizer if not connected
  if (!status || (status.state !== 'Connected' && status.state !== 'ConnectedWithTimer' && status.state !== 'ConnectionInProgress')) {
    return null;
  }

  // Parse hop names into ConfigFile format for display
  const activeHops = status.hop_name_list ? ApiService.parseHopNameList(status.hop_name_list) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
        {error && (
          <div className="mb-3 p-2 bg-red-900/20 border border-red-500/30 rounded text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <div className="flex items-center justify-center space-x-3 overflow-x-auto pb-2">
          <DeviceIcon type="user" />
          <ConnectionArrow />

          {activeHops.map((hop, index) => {
            const location = formatLocation(hop.name);
            const isLast = index === activeHops.length - 1;

            return (
              <React.Fragment key={index}>
                <ServerNode
                  location={location}
                  protocol={hop.protocol}
                  directory={hop.directory}
                />
                {!isLast && <ConnectionArrow />}
              </React.Fragment>
            );
          })}

          <FinalArrow />
          <DeviceIcon type="internet" />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${
            status.state === 'Connected' || status.state === 'ConnectedWithTimer' 
              ? 'bg-green-500/10 text-green-400' 
              : 'bg-yellow-500/10 text-yellow-400'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              status.state === 'Connected' || status.state === 'ConnectedWithTimer' 
                ? 'bg-green-400' 
                : 'bg-yellow-400'
            }`} />
            <span className="text-sm font-medium">
              {status.state === 'ConnectionInProgress' ? 'Connecting' : 'Connected'}
            </span>
          </div>

          {(status.state === 'Connected' || status.state === 'ConnectedWithTimer') && timeRemaining > 0 && (
            <TimerDisplay timeRemaining={timeRemaining} />
          )}

          {(status.state === 'Connected' || status.state === 'ConnectedWithTimer') && (
            <AddTimeButton onAddTime={handleAddTime} isLoading={isAddingTime} />
          )}

          {(status.state === 'Connected' || status.state === 'ConnectedWithTimer') && (
            <DisconnectButton onDisconnect={handleDisconnect} isDisconnecting={isDisconnecting} />
          )}
        </div>
      </div>
    </div>
  );
};

export default HopVisualizer;