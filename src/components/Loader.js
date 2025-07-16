import React, { useEffect, useState } from 'react';
import './Loader.css';

const splitText = 'shop.co'.split('');

const Loader = () => {
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    let i = 0;
    setActiveIndex(-1);
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev < splitText.length - 1 ? prev + 1 : prev));
      i++;
      if (i > splitText.length) clearInterval(interval);
    }, 120);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loader-container">
      <div className="loader-content-row">
        <div className="loader-circle small">
          <img src={process.env.PUBLIC_URL + '/favicon.ico'} alt="Loading..." className="loader-logo small" />
        </div>
        <div className="loader-split-text">
          {splitText.map((char, idx) => (
            <span
              key={idx}
              className={`split-char${idx <= activeIndex ? ' visible' : ''}`}
              style={{ transitionDelay: `${idx * 0.08}s` }}
            >
              {char}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loader; 