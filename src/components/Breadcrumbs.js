import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumbs = ({ paths = [] }) => {
  return (
    <nav style={{ fontSize: 18, color: '#888', marginBottom: 16, marginTop: 8 }} aria-label="breadcrumb">
      {paths.map((item, idx) => (
        <span key={item.name}>
          {idx < paths.length - 1 ? (
            <>
              <Link to={item.link} style={{ color: '#888', textDecoration: 'none' }}>{item.name}</Link>
              <span style={{ margin: '0 8px' }}>{'>'}</span>
            </>
          ) : (
            <span style={{ color: '#bbb' }}>{item.name}</span>
          )}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumbs; 