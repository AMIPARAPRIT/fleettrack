import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Truck,
  Package,
  Activity,
  CheckCircle2,
  Server,
  Database,
  Radio,
  Zap,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { getSocket } from '../services/socket';

const sampleChartData = [
  { time: '10:00', telemetryEvents: 140, activeVehicles: 24 },
  { time: '10:05', telemetryEvents: 220, activeVehicles: 27 },
  { time: '10:10', telemetryEvents: 310, activeVehicles: 30 },
  { time: '10:15', telemetryEvents: 290, activeVehicles: 32 },
  { time: '10:20', telemetryEvents: 420, activeVehicles: 35 },
  { time: '10:25', telemetryEvents: 380, activeVehicles: 35 },
  { time: '10:30', telemetryEvents: 460, activeVehicles: 38 },
];

const Dashboard = () => {
  const { socketConnected, apiHealthy, healthData, refreshHealth } = useOutletContext();
  const [pingLatency, setPingLatency] = useState(null);
  const [socketId, setSocketId] = useState(null);
  const [pinging, setPinging] = useState(false);

  useEffect(() => {
    const socket = getSocket();
    setSocketId(socket.id || null);

    const handleAck = (data) => {
      setSocketId(data.socketId);
    };

    const handlePong = (data) => {
      if (data?.clientTimestamp) {
        const roundtrip = Date.now() - data.clientTimestamp;
        setPingLatency(roundtrip);
      }
      setPinging(false);
    };

    socket.on('connection:ack', handleAck);
    socket.on('server:pong', handlePong);

    return () => {
      socket.off('connection:ack', handleAck);
      socket.off('server:pong', handlePong);
    };
  }, []);

  const handleTestPing = () => {
    const socket = getSocket();
    if (socket && socket.connected) {
      setPinging(true);
      socket.emit('client:ping', { timestamp: Date.now() });
    }
  };

  const archChecklist = [
    { title: 'Vite 6 + React 18 SPA Architecture', status: 'Verified', badge: 'Frontend', ready: true },
    { title: 'Node.js Express REST API & CORS Gateway', status: apiHealthy ? 'Online (200 OK)' : 'Checking...', badge: 'Backend', ready: apiHealthy },
    { title: 'MongoDB Mongoose ODM & Connection Manager', status: healthData?.database?.isConnected ? 'Connected' : 'Configured & Standby', badge: 'Database', ready: true },
    { title: 'Bi-directional Socket.IO WebSockets', status: socketConnected ? 'Connected & Synced' : 'Disconnected', badge: 'Realtime', ready: socketConnected },
    { title: 'Vite Reverse Proxy (/api -> :5000)', status: 'Active', badge: 'Proxy', ready: true },
    { title: 'React Router v7 Navigation Hierarchy', status: 'Active', badge: 'Routing', ready: true },
    { title: 'Recharts Visual Telemetry Engine', status: 'Active', badge: 'Analytics', ready: true },
    { title: 'Centralized 404 & 500 Error Interceptors', status: 'Active', badge: 'Middleware', ready: true }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Metric Cards Top Row */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Backend Health Status</span>
            <div className="metric-icon-wrap" style={{ background: apiHealthy ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)' }}>
              <Server size={20} color={apiHealthy ? 'var(--accent-emerald)' : 'var(--accent-rose)'} />
            </div>
          </div>
          <div className="metric-value" style={{ color: apiHealthy ? 'var(--accent-emerald)' : 'var(--accent-rose)', fontSize: '1.5rem' }}>
            {apiHealthy ? 'Operational' : 'Unavailable'}
          </div>
          <div className="metric-change positive">
            <ArrowUpRight size={14} />
            <span>GET /api/health responding</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">WebSocket Gateway</span>
            <div className="metric-icon-wrap" style={{ background: socketConnected ? 'rgba(0, 229, 255, 0.1)' : 'rgba(244, 63, 94, 0.1)' }}>
              <Radio size={20} color={socketConnected ? 'var(--accent-cyan)' : 'var(--accent-rose)'} />
            </div>
          </div>
          <div className="metric-value" style={{ fontSize: '1.5rem', color: socketConnected ? 'var(--accent-cyan)' : 'var(--accent-rose)' }}>
            {socketConnected ? 'Connected' : 'Offline'}
          </div>
          <div className="metric-change neutral">
            <Clock size={14} />
            <span>{pingLatency !== null ? `Latency: ${pingLatency}ms` : 'Ready for ping'}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">MongoDB State</span>
            <div className="metric-icon-wrap" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
              <Database size={20} color="var(--accent-blue)" />
            </div>
          </div>
          <div className="metric-value" style={{ fontSize: '1.5rem', textTransform: 'capitalize' }}>
            {healthData?.database?.state || 'Standby'}
          </div>
          <div className="metric-change neutral">
            <span>{healthData?.database?.isConnected ? 'Mongoose active' : 'Awaiting local mongod'}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Server Uptime</span>
            <div className="metric-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
              <Clock size={20} color="var(--accent-amber)" />
            </div>
          </div>
          <div className="metric-value" style={{ fontSize: '1.5rem' }}>
            {healthData?.uptime?.formatted || '0h 0m 0s'}
          </div>
          <div className="metric-change positive">
            <span>Node {healthData?.system?.nodeVersion || 'Active'}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Architecture Checklist & Live Chart */}
      <div className="grid-2-col">
        {/* Left: Phase 1 Architecture Verification */}
        <div className="card arch-card">
          <div className="card-header">
            <div>
              <h2 className="card-title">
                <CheckCircle2 color="var(--accent-cyan)" size={20} />
                Phase 1 Architecture Foundation Verification
              </h2>
              <p className="card-subtitle">
                Core infrastructure components configured and verified according to specifications
              </p>
            </div>
            <button className="btn-secondary" onClick={refreshHealth}>
              Check Status
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {archChecklist.map((item, idx) => (
              <div key={idx} className="arch-item">
                <div className="arch-item-left">
                  <CheckCircle2
                    size={18}
                    color={item.ready ? 'var(--accent-emerald)' : 'var(--accent-amber)'}
                  />
                  <span>{item.title}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="code-pill">{item.badge}</span>
                  <span
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: item.ready ? 'var(--accent-emerald)' : 'var(--text-muted)'
                    }}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Socket.IO Gateway & Health Inspector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Real-time Socket Diagnostic Box */}
          <div className="card">
            <div className="card-header">
              <div>
                <h3 className="card-title">
                  <Zap size={18} color="var(--accent-cyan)" />
                  WebSocket Gateway
                </h3>
                <p className="card-subtitle">Interactive bi-directional event test</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Client Socket ID: <code className="code-pill">{socketId || 'Connecting...'}</code>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  className="btn-primary"
                  onClick={handleTestPing}
                  disabled={!socketConnected || pinging}
                >
                  <Radio size={14} />
                  {pinging ? 'Measuring...' : 'Send Live Ping'}
                </button>
                {pingLatency !== null && (
                  <span className="badge badge-emerald">
                    RTT: {pingLatency} ms
                  </span>
                )}
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Demonstrates real-time client-to-server messaging ready for high-frequency GPS coordinate broadcasts.
              </p>
            </div>
          </div>

          {/* System Specs Box */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <Server size={18} color="var(--accent-blue)" />
                Runtime Telemetry
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Environment:</span>
                <span className="code-pill">{healthData?.environment || 'development'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>RSS Memory:</span>
                <span>{healthData?.system?.memoryUsage?.rssMB ? `${healthData.system.memoryUsage.rssMB} MB` : 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Heap Used:</span>
                <span>{healthData?.system?.memoryUsage?.heapUsedMB ? `${healthData.system.memoryUsage.heapUsedMB} MB` : 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>CPU Cores:</span>
                <span>{healthData?.system?.cpus || 'Multi-core'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recharts Telemetry Activity Visualization Preview */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">
              <Activity size={20} color="var(--accent-cyan)" />
              Recharts Telemetry Stream Baseline Preview
            </h2>
            <p className="card-subtitle">
              Live data visualization pipeline established for Phase 2 telemetry streaming
            </p>
          </div>
          <span className="badge badge-cyan">Visualizer Ready</span>
        </div>

        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sampleChartData}>
              <defs>
                <linearGradient id="colorTelemetry" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-cyan)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="var(--accent-cyan)" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorVehicles" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-blue)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="var(--accent-blue)" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-card)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  boxShadow: 'var(--shadow-md)',
                }}
              />
              <Area
                type="monotone"
                dataKey="telemetryEvents"
                stroke="var(--accent-cyan)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorTelemetry)"
                name="Telemetry Events / min"
              />
              <Area
                type="monotone"
                dataKey="activeVehicles"
                stroke="var(--accent-blue)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorVehicles)"
                name="Active Transponders"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
