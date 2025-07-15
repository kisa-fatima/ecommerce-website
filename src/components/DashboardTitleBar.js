import React from 'react';
import { FiDownload, FiShare2 } from 'react-icons/fi';

const DashboardTitleBar = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    marginTop: 8,
    flexWrap: 'wrap',
    gap: 12
  }}>
    <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0 }}>General dashboard</h1>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <select style={{
        border: '1px solid #e0e0e0',
        borderRadius: 8,
        padding: '6px 16px',
        fontSize: 15,
        background: '#fafbfc',
        outline: 'none',
        fontWeight: 500
      }}>
        <option>Last 30 Days</option>
        <option>Last 7 Days</option>
        <option>Last Year</option>
      </select>
      <button style={{
        border: '1px solid #e0e0e0',
        borderRadius: 8,
        padding: '6px 18px',
        fontSize: 15,
        background: '#fff',
        fontWeight: 500,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }}>
        <FiDownload size={18} /> Download
      </button>
      <button style={{
        border: '1px solid #e0e0e0',
        borderRadius: 8,
        padding: '6px 18px',
        fontSize: 15,
        background: '#fff',
        fontWeight: 500,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }}>
        <FiShare2 size={18} /> Share Board
      </button>
    </div>
  </div>
);

export default DashboardTitleBar; 