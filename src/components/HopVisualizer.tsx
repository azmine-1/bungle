import React, { useState, useEffect } from 'react';
import ApiService from '../services/ApiService';
import type { StatusResponse, TimeoutResponse } from '../services/ApiService';
import type { FileData, ConfigFile } from '../types';

interface HopVisualizerProps {
  selectedFiles: ConfigFile[];
  fileData: FileData | null;
}

// Utility functions
const formatLocation = (name: string) => 
  name.split('.')[0]
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const formatTime = (seconds: number): string => {
  if (seconds <= 0) return '00:00:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Components
const ServerNode = ({ location, protocol, directory }: {
  location: string;
  protocol: string;
  directory: string;
}) => (
  <div className="flex flex-col items-center group flex-shrink-0">
    <div className="text-xs text-slate-400 mb-1 font-medium">Hop</div>
    <div className="relative">
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-lg border border-blue-400/30 transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:border-blue-400/50">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg animate-pulse" />
        <div className="relative z-10 text-center">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
          </svg>
          <span className="text-white font-bold text-xs leading-tight">{location}</span>
        </div>
      </div>
    </div>
    <div className="mt-1 text-center space-y-1">
      <div className="text-xs font-semibold text-blue-400 bg-blue-400/10 px-1 py-0.5 rounded border border-blue-400/20">
        {protocol.toUpperCase()}
      </div>
      <div className="text-xs text-slate-300 bg-slate-800/50 px-1 py-0.5 rounded border border-slate-700">
        {directory}
      </div>
    </div>
  </div>
);

const ConnectionArrow = () => (
  <div className="flex items-center flex-shrink-0">
    <div className="w-6 sm:w-8 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 relative">
      <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-0 h-0" 
           style={{ 
             borderLeft: '6px solid #6366f1', 
             borderTop: '3px solid transparent', 
             borderBottom: '3px solid transparent' 
           }} />
    </div>
  </div>
);

const FinalArrow = () => (
  <div className="flex items-center flex-shrink-0">
    <div className="w-6 sm:w-8 h-0.5 bg-gradient-to-r from-indigo-500 to-green-500 relative">
      <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-0 h-0" 
           style={{ 
             borderLeft: '6px solid #10b981', 
             borderTop: '3px solid transparent', 
             borderBottom: '3px solid transparent' 
           }} />
    </div>
  </div>
);

const DeviceIcon = ({ type, label }: { type: 'user' | 'internet'; label: string }) => (
  <div className="flex flex-col items-center flex-shrink-0">
    <div className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br ${type === 'user' ? 'from-gray-700 to-gray-800' : 'from-green-600 to-emerald-700'} rounded-lg flex items-center justify-center shadow-lg border ${type === 'user' ? 'border-gray-600' : 'border-green-500/30'}`}>
      <svg className={`w-3 h-3 sm:w-4 sm:h-4 ${type === 'user' ? 'text-gray-300' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {type === 'user' ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        )}
      </svg>
    </div>
    <span className="text-xs text-slate-400 mt-1 font-medium">{label}</span>
  </div>
);

const DisconnectButton = ({ onDisconnect, isDisconnecting }: { 
  onDisconnect: () => void; 
  isDisconnecting: boolean;
}) => (
  <button
    onClick={onDisconnect}
    disabled={isDisconnecting}
    className="inline-flex items-center space-x-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/30 rounded-full px-3 py-1.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {isDisconnecting ? (
      <svg className="w-3 h-3 text-red-400 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    ) : (
      <svg className="w-3 h-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    )}
    <span className="text-red-400 text-xs font-medium">
      {isDisconnecting ? 'Disconnecting...' : 'Disconnect'}
    </span>
  </button>
);

const Timer = ({ timeRemaining }: { timeRemaining: number }) => (
  <div className="inline-flex items-center space-x-1 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1.5">
    <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <span className="text-blue-400 text-xs font-medium font-mono">
      {formatTime(timeRemaining)}
    </span>
  </div>
);

const HopVisualizer: React.FC<HopVisualizerProps> = () => {
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch status and timeout on component mount and set up polling
  useEffect(() => {
    let statusInterval: ReturnType<typeof setInterval>;
    let timeoutInterval: ReturnType<typeof setInterval>;

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
    statusInterval = setInterval(fetchStatus, 2000);

    // Set up polling for timeout (every second when connected)
    timeoutInterval = setInterval(() => {
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

  // Don't show visualizer if not connected
  if (!status || (status.state !== 'Connected' && status.state !== 'ConnectedWithTimer' && status.state !== 'ConnectionInProgress')) {
    return null;
  }

  // Parse hop names into ConfigFile format for display
  const activeHops = status.hop_name_list ? ApiService.parseHopNameList(status.hop_name_list) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-3">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg p-3 shadow-xl border border-slate-700">
        {error && (
          <div className="mb-3 p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-xs text-center">{error}</p>
          </div>
        )}

        <div className="text-center mb-3">
          <h2 className="text-sm sm:text-base font-bold text-white mb-1">
            {status.state === 'ConnectionInProgress' ? 'Connecting...' : 'Active VPN Route'}
          </h2>
          <p className="text-xs text-slate-300">
            {status.state === 'ConnectionInProgress' 
              ? 'Establishing connection through selected hops'
              : `Connected through ${activeHops.length} secure hop${activeHops.length > 1 ? 's' : ''}`
            }
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-green-500/10 rounded-lg blur-xl" />
          
          <div className="relative flex items-center justify-center space-x-2 sm:space-x-3 overflow-x-auto pb-2 px-2 sm:px-0">
            <DeviceIcon type="user" label="Your Device" />
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
            <DeviceIcon type="internet" label="Internet" />
          </div>
        </div>

        <div className="mt-3 flex items-center justify-center space-x-3">
          {/* Connection Status */}
          <div className={`inline-flex items-center space-x-1 rounded-full px-2 py-1 ${
            status.state === 'Connected' || status.state === 'ConnectedWithTimer' 
              ? 'bg-green-500/10 border border-green-500/20'
              : 'bg-yellow-500/10 border border-yellow-500/20'
          }`}>
            <svg className={`w-3 h-3 ${
              status.state === 'Connected' || status.state === 'ConnectedWithTimer' 
                ? 'text-green-400' 
                : 'text-yellow-400'
            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className={`text-xs font-medium ${
              status.state === 'Connected' || status.state === 'ConnectedWithTimer' 
                ? 'text-green-400' 
                : 'text-yellow-400'
            }`}>
              {status.state === 'ConnectionInProgress' ? 'Connecting' : 'Connected'}
            </span>
          </div>

          {/* Timer */}
          {(status.state === 'Connected' || status.state === 'ConnectedWithTimer') && timeRemaining > 0 && (
            <Timer timeRemaining={timeRemaining} />
          )}

          {/* Disconnect Button */}
          {(status.state === 'Connected' || status.state === 'ConnectedWithTimer') && (
            <DisconnectButton onDisconnect={handleDisconnect} isDisconnecting={isDisconnecting} />
          )}
        </div>
      </div>
    </div>
  );
};

export default HopVisualizer;