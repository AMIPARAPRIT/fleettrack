import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { checkHealth } from '../../services/api';
import { getSocket } from '../../services/socket';

const pageTitles = {
  '/': 'Fleet Overview & Architecture Control',
  '/map': 'Real-Time Fleet Telemetry Map',
  '/vehicles': 'Vehicle Registry & Asset Management',
  '/shipments': 'Consignments & Dispatch Tracking',
  '/analytics': 'Performance Analytics & Route Metrics',
  '/alerts': 'Geofence & Safety System Alerts',
  '/settings': 'Gateway & Portal Settings',
};

const Shell = () => {
  const location = useLocation();
  const [socketConnected, setSocketConnected] = useState(false);
  const [apiHealthy, setApiHealthy] = useState(false);
  const [healthData, setHealthData] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchHealth = async () => {
    setIsRefreshing(true);
    try {
      const data = await checkHealth();
      setHealthData(data);
      setApiHealthy(data?.status === 'ok');
    } catch (err) {
      console.warn('API Health check failed:', err.message);
      setApiHealthy(false);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // 1. Initial health check
    fetchHealth();
    const healthInterval = setInterval(fetchHealth, 15000);

    // 2. Connect socket
    const socket = getSocket();
    if (socket.connected) {
      setSocketConnected(true);
    }

    const handleConnect = () => setSocketConnected(true);
    const handleDisconnect = () => setSocketConnected(false);

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    return () => {
      clearInterval(healthInterval);
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, []);

  const currentTitle = pageTitles[location.pathname] || 'Fleet Management Portal';

  return (
    <div className="app-container">
      <Sidebar socketConnected={socketConnected} apiHealthy={apiHealthy} />
      <div className="main-content">
        <Header
          title={currentTitle}
          onRefresh={fetchHealth}
          isRefreshing={isRefreshing}
          healthData={healthData}
        />
        <main className="page-container">
          <Outlet
            context={{
              socketConnected,
              apiHealthy,
              healthData,
              refreshHealth: fetchHealth,
            }}
          />
        </main>
      </div>
    </div>
  );
};

export default Shell;
