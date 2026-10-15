import React from 'react';
import { Settings as SettingsIcon, Sliders, Shield } from 'lucide-react';

const Settings = () => {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">
            <SettingsIcon color="var(--accent-cyan)" size={20} />
            System & Gateway Configuration
          </h2>
          <p className="card-subtitle">
            Telemetry ingestion rates, webhook endpoints, and API security keys
          </p>
        </div>
      </div>

      <div className="placeholder-wrap">
        <div className="placeholder-icon">
          <Sliders size={32} />
        </div>
        <h3 className="placeholder-title">Settings & System Preferences</h3>
        <p className="placeholder-desc">
          System parameters, geofence definitions, telemetry sampling frequency, and notification preferences will be configurable here in subsequent phases.
        </p>
        <span className="badge badge-cyan">Scheduled for Phase 2</span>
      </div>
    </div>
  );
};

export default Settings;
