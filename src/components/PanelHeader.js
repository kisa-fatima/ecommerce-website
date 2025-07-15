import React from 'react';

const PanelHeader = ({ children }) => (
  <header style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#fff',
    padding: '0 32px',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
    minHeight: 64,
    height: 64,
    position: 'relative',
    zIndex: 20,
    borderBottom: '1px solid #f0f0f0',
  }}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        borderRadius: '50%',
        background: '#fff',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        marginRight: 0,
        border: '1px solid #eee',
      }}>
        <img src={process.env.PUBLIC_URL + '/favicon.ico'} alt="Logo" style={{ width: 24, height: 24 }} />
      </span>
    </div>
    <div>{children}</div>
  </header>
);

export default PanelHeader; 