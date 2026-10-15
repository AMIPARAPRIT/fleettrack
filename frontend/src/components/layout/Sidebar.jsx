import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Truck,
  MapPin,
  Package,
  Activity,
  AlertTriangle,
  Settings,
  Radio,
  Cpu
} from 'lucide-react';

const Sidebar = ({ socketConnected, apiHealthy }) => {
  const navItems = [
    { section: 'OPERATIONS' },
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Live Fleet Map', path: '/map', icon: MapPin },
    { name: 'Vehicles', path: '/vehicles', icon: Truck },
    { name: 'Shipments', path: '/shipments', icon: Package },
    { section: 'INTELLIGENCE' },
    { name: 'Analytics', path: '/analytics', icon: Activity },
    { name: 'System Alerts', path: '/alerts', icon: AlertTriangle },
    { section: 'MANAGEMENT' },
    { name: 'System Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="brand-icon">
          <Truck size={22} />
        </div>
        <div>
          <div className="brand-title">
            Fleet<span>Pulse</span>
          </div>
        </div>
        <span className="brand-badge">v1.0</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((item, idx) => {
          if (item.section) {
            return (
              <div key={idx} className="nav-section-title">
                {item.section}
              </div>
            );
          }
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
            >
              <Icon />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer System Status */}
      <div className="sidebar-footer">
        <div className="socket-status-card">
          <div className="status-indicator">
            <span
              className={`status-dot ${socketConnected ? 'online' : 'offline'}`}
            />
            <span>WebSocket Live</span>
          </div>
          <Radio
            size={16}
            color={socketConnected ? 'var(--accent-emerald)' : 'var(--text-muted)'}
          />
        </div>
        <div className="socket-status-card" style={{ marginTop: '8px' }}>
          <div className="status-indicator">
            <span
              className={`status-dot ${apiHealthy ? 'online' : 'warning'}`}
            />
            <span>API Gateway</span>
          </div>
          <Cpu
            size={16}
            color={apiHealthy ? 'var(--accent-cyan)' : 'var(--accent-amber)'}
          />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
