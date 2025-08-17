import React from 'react';

export default function Spinner() {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 120 }}>
      <div className="spinner-border" role="status" aria-hidden="true"></div>
    </div>
  );
}
