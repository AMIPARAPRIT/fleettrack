import React from 'react';
import { Package, Plus } from 'lucide-react';

const Shipments = () => {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">
            <Package color="var(--accent-cyan)" size={20} />
            Consignments & Dispatches
          </h2>
          <p className="card-subtitle">
            Shipment tracking, waypoint ETA calculations, and freight status monitoring
          </p>
        </div>
        <button className="btn-primary" disabled style={{ opacity: 0.7, cursor: 'not-allowed' }}>
          <Plus size={14} /> Create Consignment (Phase 2)
        </button>
      </div>

      <div className="placeholder-wrap">
        <div className="placeholder-icon">
          <Package size={32} />
        </div>
        <h3 className="placeholder-title">Shipment Dispatch Pipeline</h3>
        <p className="placeholder-desc">
          State machine, waypoints, geofenced dropoffs, and real-time transit status updates will be implemented in subsequent phases.
        </p>
        <span className="badge badge-cyan">Scheduled for Phase 2</span>
      </div>
    </div>
  );
};

export default Shipments;
