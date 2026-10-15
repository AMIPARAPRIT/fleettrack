import React from 'react';
import { RefreshCw, Bell, ShieldCheck, Terminal } from 'lucide-react';

const Header = ({ title, onRefresh, isRefreshing, healthData }) => {
  return (
    <header className="top-header">
      <div className="header-left">
        <h1 className="page-title">{title}</h1>
        <div className="header-badges">
          <span className="badge badge-cyan">
            <Terminal size={12} />
            Phase 1 Foundation
          </span>
          {healthData?.database?.isConnected ? (
            <span className="badge badge-emerald">
              <ShieldCheck size={12} />
              MongoDB Connected
            </span>
          ) : (
            <span className="badge badge-amber">
              <ShieldCheck size={12} />
              MongoDB Ready (Waiting Connection)
            </span>
          )}
        </div>
      </div>

      <div className="header-right">
        <button
          className="header-action-btn"
          onClick={onRefresh}
          disabled={isRefreshing}
          title="Refresh Backend Health"
        >
          <RefreshCw
            size={14}
            className={isRefreshing ? 'animate-spin' : ''}
            style={isRefreshing ? { animation: 'spin 1s linear infinite' } : {}}
          />
          <span>{isRefreshing ? 'Syncing...' : 'Sync Health'}</span>
        </button>

        <button className="header-action-btn" title="System Notifications">
          <Bell size={16} />
        </button>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </header>
  );
};

export default Header;
