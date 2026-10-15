import React from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

const Alerts = () => {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">
            <AlertTriangle color="var(--accent-amber)" size={20} />
            System Alerts & Safety Violations
          </h2>
          <p className="card-subtitle">
            Threshold breaches, overspeeding alerts, harsh braking, geofence breaches, and maintenance warnings
          </p>
        </div>
      </div>

      <div className="placeholder-wrap">
        <div className="placeholder-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--accent-amber)' }}>
          <ShieldAlert size={32} />
        </div>
        <h3 className="placeholder-title">Alert & Rule Evaluation Engine</h3>
        <p className="placeholder-desc">
          Automated rules engine for evaluating incoming vehicle telemetry against thresholds and dispatching real-time notifications will be implemented in subsequent phases.
        </p>
        <span className="badge badge-amber">Scheduled for Phase 2</span>
      </div>
    </div>
  );
};

export default Alerts;
