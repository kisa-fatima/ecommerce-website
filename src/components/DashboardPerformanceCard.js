import React from 'react';

const DashboardPerformanceCard = () => (
  <div style={{
    background: '#fafbfc',
    borderRadius: 18,
    boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
    padding: '32px 28px',
    minWidth: 260,
    minHeight: 160,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    border: '1px solid #f0f0f0',
    marginBottom: 16
  }}>
    <div style={{ fontSize: 15, color: '#888', marginBottom: 8 }}>Since joined</div>
    <div style={{ fontWeight: 700, fontSize: 22, color: '#222', marginBottom: 8 }}>Performance Overview</div>
    <div style={{ fontSize: 15, color: '#bbb' }}>(Revenue and order stats coming soon)</div>
    <div style={{ marginTop: 18, color: '#e0e0e0', fontSize: 32 }}>
      <span role="img" aria-label="chart">📊</span>
    </div>
  </div>
);

export default DashboardPerformanceCard; 