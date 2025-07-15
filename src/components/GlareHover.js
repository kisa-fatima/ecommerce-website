import React from 'react';
import '../styles/GlareHover.css';

const GlareHover = ({
  children,
  glareColor = '#fff',
  glareOpacity = 0.3,
  glareAngle = -30,
  glareSize = 300,
  transitionDuration = 800,
  playOnce = false,
  style = {},
  ...rest
}) => {
  // Convert color and opacity to rgba
  const hexToRgba = (hex, opacity) => {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16);
    return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${opacity})`;
  };
  const glareRgba = hexToRgba(glareColor, glareOpacity);

  const vars = {
    '--gh-width': '100%',
    '--gh-height': '100%',
    '--gh-bg': 'inherit',
    '--gh-br': '16px',
    '--gh-border': '#ececec',
    '--gh-angle': `${glareAngle}deg`,
    '--gh-rgba': glareRgba,
    '--gh-size': `${glareSize}px`,
    '--gh-duration': `${transitionDuration}ms`,
  };

  return (
    <div
      className={`glare-hover${playOnce ? ' glare-hover--play-once' : ''}`}
      style={{ ...vars, ...style }}
      {...rest}
    >
      {children}
    </div>
  );
};

export default GlareHover; 