import React, { useState, useEffect, useRef } from 'react';
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
  const [hasNotifiedLowTime, setHasNotifiedLowTime] = useState(false);

  // WebSocket reference
  const wsRef = useRef<WebSocket | null>(null);
  // Timer reference for local countdown
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // ========== CHANGE 1: Modified useEffect to use WebSocket instead of polling ==========
  useEffect(() => {
    const initializeConnection = async () => {
      try {
        // Initial status fetch
        const statusResponse = await ApiService.getStatus();
        setStatus(statusResponse);
        setError(null);

        // Get initial timeout if connected
        if (statusResponse.state === 'Connected' || statusResponse.state === 'ConnectedWithTimer') {
          try {
            const timeoutResponse = await ApiService.getTimeout();
            setTimeRemaining(timeoutResponse.seconds_remaining);
          } catch (err) {
            console.error('Failed to fetch initial timeout:', err);
          }
        }
      } catch (err) {
        console.error('Failed to fetch initial status:', err);
        setError('Failed to fetch connection status');
      }
    };

    // Set up WebSocket connection for real-time status updates
    const setupWebSocket = () => {
      wsRef.current = ApiService.createStatusWebSocket(
        (statusData) => {
          setStatus(statusData);
          setError(null);
          
          // If we just connected, fetch the timeout
          if (statusData.state === 'Connected' || statusData.state === 'ConnectedWithTimer') {
            ApiService.getTimeout().then(timeoutResponse => {
              setTimeRemaining(timeoutResponse.seconds_remaining);
            }).catch(err => {
              console.error('Failed to fetch timeout after status update:', err);
            });
          } else {
            // If disconnected, reset timer
            setTimeRemaining(0);
          }
        },
        (error) => {
          console.error('WebSocket error:', error);
          setError('Connection to server lost');
        },
        (event) => {
          console.log('WebSocket closed:', event);
          // Attempt to reconnect after a delay
          setTimeout(() => {
            if (wsRef.current?.readyState === WebSocket.CLOSED) {
              setupWebSocket();
            }
          }, 3000);
        }
      );
    };

    // Initialize
    initializeConnection();
    setupWebSocket();

    // Cleanup function
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []); // Empty dependency array - only run once

  // ========== CHANGE 2: New useEffect for local timer countdown ==========
  useEffect(() => {
    // Clear existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Only start timer if we have time remaining and are connected
    if (timeRemaining > 0 && (status?.state === 'Connected' || status?.state === 'ConnectedWithTimer')) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Timer expired, clear interval
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timeRemaining, status?.state]);

  // Handle low time notifications (unchanged)
  useEffect(() => {
    const tenMinutesInSeconds = 10 * 60; // 600 seconds
    
    if (timeRemaining > 0 && timeRemaining <= tenMinutesInSeconds && !hasNotifiedLowTime) {
      // Request notification permission if not already granted
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
      
      // Show browser notification if permission is granted
      if (Notification.permission === 'granted') {
        new Notification('VPN Connection Warning', {
          body: `Your VPN connection will expire in ${Math.ceil(timeRemaining / 60)} minutes`,
          icon: '/favicon.ico'
        });
      }
      
      setHasNotifiedLowTime(true);
    }
    
    // Reset notification flag when time is extended
    if (timeRemaining > tenMinutesInSeconds && hasNotifiedLowTime) {
      setHasNotifiedLowTime(false);
    }
  }, [timeRemaining, hasNotifiedLowTime]);

  const handleDisconnect = async () => {
    try {
      setIsDisconnecting(true);
      setError(null);
      await ApiService.disconnect();
      
      // The WebSocket will automatically update the status
      setTimeRemaining(0);
    } catch (err) {
      console.error('Failed to disconnect:', err);
      setError('Failed to disconnect');
    } finally {
      setIsDisconnecting(false);
    }
  };

  // ========== CHANGE 3: Modified handleAddTime to update local timer ==========
  const handleAddTime = async () => {
    try {
      setIsAddingTime(true);
      setError(null);
      await ApiService.addTimeout(3600); // Add 1 hour (3600 seconds)
      
      // Update local timer directly instead of fetching from server
      setTimeRemaining(prev => prev + 3600);
      
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
