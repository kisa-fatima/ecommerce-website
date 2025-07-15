import React from 'react';
import { FaBell } from 'react-icons/fa';

const PanelHeader = ({ children }) => (
  <header style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#fff',
    padding: '0 24px',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
    minHeight: 48,
    height: 48,
    position: 'relative',
    zIndex: 20,
    borderBottom: '1px solid #f0f0f0',
  }}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 32,
        height: 32,
        borderRadius: '50%',
        background: '#fff',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        marginRight: 0,
        border: '1px solid #eee',
      }}>
        <img src={process.env.PUBLIC_URL + '/favicon.ico'} alt="Logo" style={{ width: 18, height: 18 }} />
      </span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
      <FaBell size={18} color="#444" style={{ cursor: 'pointer' }} />
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 28,
        height: 28,
        borderRadius: '50%',
        background: '#222',
        color: '#fff',
        fontWeight: 600,
        fontSize: 15,
        fontFamily: 'Montserrat, Arial, sans-serif',
        cursor: 'pointer',
      }}>
        A
      </span>
    </div>
  </header>
);

export default PanelHeader; 