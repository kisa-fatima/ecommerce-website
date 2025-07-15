import React from 'react';
import GlareHover from './GlareHover';

const DashboardStatsCard = ({ icon, label, value }) => (
  <GlareHover
    glareColor="#ffffff"
    glareOpacity={0.3}
    glareAngle={-30}
    glareSize={300}
    transitionDuration={800}
    playOnce={false}
  >
    <div className="glare-hover" style={{
      width: '100%',
      height: '100%',
      background: '#111',
      borderRadius: 16,
      padding: '32px 44px',
      minWidth: 240,
      minHeight: 140,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
      border: '1px solid #222',
      margin: 0
    }}>
      <div style={{ fontSize: 26, marginBottom: 10, color: '#fff' }}>{icon}</div>
      <div style={{ fontSize: 17, color: '#eee', marginBottom: 10 }}>{label}</div>
      <div style={{ fontWeight: 700, fontSize: 40, color: '#fff' }}>{value}</div>
    </div>
  </GlareHover>
);

export default DashboardStatsCard; 