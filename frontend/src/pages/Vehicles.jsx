import React from 'react';
import { Truck, Layers, Plus } from 'lucide-react';

const Vehicles = () => {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">
            <Truck color="var(--accent-cyan)" size={20} />
            Fleet Vehicles & Transponders
          </h2>
          <p className="card-subtitle">
            Vehicle directory, asset tracking, driver assignments, and telemetry status
          </p>
        </div>
        <button className="btn-primary" disabled style={{ opacity: 0.7, cursor: 'not-allowed' }}>
          <Plus size={14} /> Add Vehicle (Phase 2)
        </button>
      </div>

      <div className="placeholder-wrap">
        <div className="placeholder-icon">
          <Truck size={32} />
        </div>
        <h3 className="placeholder-title">Vehicle Management Module</h3>
        <p className="placeholder-desc">
          Architecture foundation ready. Vehicle models, CRUD controllers, GPS transponder simulation, and driver pairing will be enabled in subsequent phases.
        </p>
        <span className="badge badge-cyan">Scheduled for Phase 2</span>
      </div>
    </div>
  );
};

export default Vehicles;
