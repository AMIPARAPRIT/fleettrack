import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="card">
      <div className="placeholder-wrap" style={{ padding: '80px 20px' }}>
        <div className="placeholder-icon" style={{ background: 'rgba(244, 63, 94, 0.1)', color: 'var(--accent-rose)' }}>
          <HelpCircle size={36} />
        </div>
        <h2 className="placeholder-title">404 - Page Not Found</h2>
        <p className="placeholder-desc">
          The navigation endpoint you requested does not exist or has been relocated in the portal hierarchy.
        </p>
        <Link to="/" className="btn-primary" style={{ marginTop: '12px' }}>
          <ArrowLeft size={16} /> Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
