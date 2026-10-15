import React from 'react';
import { Activity, BarChart3 } from 'lucide-react';

const Analytics = () => {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">
            <Activity color="var(--accent-cyan)" size={20} />
            Fleet Analytics & Fuel Optimization
          </h2>
          <p className="card-subtitle">
            Fleet efficiency, mileage heatmaps, idle time analysis, and maintenance diagnostics
          </p>
        </div>
      </div>

      <div className="placeholder-wrap">
        <div className="placeholder-icon">
          <BarChart3 size={32} />
        </div>
        <h3 className="placeholder-title">Operational Intelligence Engine</h3>
        <p className="placeholder-desc">
          Aggregated analytics, telemetry rollups, fuel consumption estimation, and historical playback will be implemented in subsequent phases.
        </p>
        <span className="badge badge-cyan">Scheduled for Phase 2</span>
      </div>
    </div>
  );
};

export default Analytics;
