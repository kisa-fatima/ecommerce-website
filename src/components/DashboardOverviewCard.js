import React from 'react';
import DashboardStatsCard from './DashboardStatsCard';
import { FaChartBar, FaShoppingCart } from 'react-icons/fa';

const DashboardOverviewCard = () => (
  <div style={{
    display: 'flex',
    background: '#f6f7fa',
    borderRadius: 22,
    boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
    border: '1px solid #ececec',
    padding: '32px 32px',
    gap: 32,
    alignItems: 'stretch',
    marginBottom: 24,
    marginTop: 8,
    flexWrap: 'wrap',
    minWidth: 0
  }}>
    <div style={{
      minWidth: 220,
      minHeight: 140,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      paddingRight: 32,
      borderRight: '1px solid #f0f0f0',
      marginRight: 16,
      borderRadius: 18
    }}>
      <div style={{ fontSize: 15, color: '#888', marginBottom: 8 }}>Since joined</div>
      <div style={{ fontWeight: 700, fontSize: 22, color: '#222', marginBottom: 8 }}>Performance Overview</div>
    </div>
    <div style={{ display: 'flex', gap: 24, flex: 1, minWidth: 0, flexWrap: 'wrap' }}>
      <DashboardStatsCard icon={<FaChartBar />} label="Total Revenue" value={<span style={{ color: '#bbb' }}>—</span>} />
      <DashboardStatsCard icon={<FaShoppingCart />} label="Total Item Orders" value={<span style={{ color: '#bbb' }}>—</span>} />
    </div>
  </div>
);

export default DashboardOverviewCard; 