import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// Map URL segments to readable labels
const LABELS = {
  '': 'Home',
  'shop': 'Shop',
  'men': 'Men',
  'women': 'Women',
  'kids': 'Kids',
  't-shirts': 'T-shirts',
  'casual': 'Casual',
  'formal': 'Formal',
  'party': 'Party',
  'gym': 'Gym',
  // Add more as needed
};

const Breadcrumbs = ({ white }) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);
  const color = white ? '#fff' : '#888';
  const activeColor = white ? '#fff' : '#222';
  const separatorColor = white ? '#fff' : '#bbb';

  return (
    <nav style={{ margin: '16px 0' }} aria-label="breadcrumb">
      <ol style={{ display: 'flex', listStyle: 'none', padding: 0, margin: 0 }}>
        <li>
          <Link to="/" style={{ color, textDecoration: 'none', fontWeight: 400 }}>{LABELS['']}</Link>
        </li>
        {pathnames.map((value, idx) => {
          const to = '/' + pathnames.slice(0, idx + 1).join('/');
          const isLast = idx === pathnames.length - 1;
          const label = LABELS[value.toLowerCase()] || value.charAt(0).toUpperCase() + value.slice(1);
          return (
            <React.Fragment key={to}>
              <span style={{ margin: '0 8px', color: separatorColor }}>{'>'}</span>
              <li>
                {isLast ? (
                  <span style={{ fontWeight: 500, color: activeColor }}>{label}</span>
                ) : (
                  <Link to={to} style={{ color, textDecoration: 'none', fontWeight: 400 }}>{label}</Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs; 