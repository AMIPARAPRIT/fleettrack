import React from 'react';
import { MapPin, Navigation, Compass } from 'lucide-react';

const LiveMap = () => {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">
            <MapPin color="var(--accent-cyan)" size={20} />
            Live Fleet Geospatial Tracker
          </h2>
          <p className="card-subtitle">
            Interactive map rendering live GPS breadcrumb trails, geofence polygons, and vehicle orientation
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span className="badge badge-cyan">
            <Navigation size={12} /> WebSocket Stream Ready
          </span>
        </div>
      </div>

      <div className="placeholder-wrap">
        <div className="placeholder-icon">
          <Compass size={32} />
        </div>
        <h3 className="placeholder-title">Geospatial Telemetry Map</h3>
        <p className="placeholder-desc">
          Map rendering engine with Leaflet/MapLibre, real-time marker interpolation, and geofence polygons will be implemented in subsequent phases.
        </p>
        <span className="badge badge-cyan">Scheduled for Phase 2</span>
      </div>
    </div>
  );
};

export default LiveMap;
