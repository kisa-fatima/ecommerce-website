import React, { useEffect, useState } from 'react';
import '../styles/AboveHeader.css';

const messages = [
  'Order any 2 dresses and Enjoy&nbsp;<span class="highlight">FREE HOME DELIVERY</span>',
  '<span class="highlight" style="display:inline-flex;align-items:center;gap:0.4em"><span class="icon"><svg style="vertical-align:middle" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6 0 1.3-.42 2.5-1.13 3.47l1.46 1.46C19.09 16.01 20 14.11 20 12c0-4.08-3.06-7.44-7-7.93zm-6.36.64l1.41 1.41C5.11 8.01 4 9.89 4 12c0 4.08 3.06 7.44 7 7.93v4.07l5-5-5-5v4.07C8.69 19 6 16.31 6 13c0-1.3.42-2.5 1.13-3.47z"/></svg></span> Easy 7-day return policy <span style="color:#fff;font-weight:400;margin-left:6px">– shop worry-free!</span></span>'
];

const shortMessages = [
  '2+ dresses: <span class="highlight">FREE DELIVERY</span>',
  '<span class="highlight" style="display:inline-flex;align-items:center;gap:0.2em"><span class="icon"><svg style="vertical-align:middle" width="15" height="15" viewBox="0 0 24 24"><path fill="currentColor" d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6 0 1.3-.42 2.5-1.13 3.47l1.46 1.46C19.09 16.01 20 14.11 20 12c0-4.08-3.06-7.44-7-7.93zm-6.36.64l1.41 1.41C5.11 8.01 4 9.89 4 12c0 4.08 3.06 7.44 7 7.93v4.07l5-5-5-5v4.07C8.69 19 6 16.31 6 13c0-1.3.42-2.5 1.13-3.47z"/></svg></span> 7-day return <span style="color:#fff;font-weight:400;margin-left:4px">– worry-free!</span></span>'
];

const SLIDE_DURATION = 20000; // 14 seconds

const AboveHeader = () => {
  const [current, setCurrent] = useState(0);
  const [key, setKey] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % messages.length);
      setKey((k) => k + 1); // force re-mount for fresh animation
    }, SLIDE_DURATION);
    return () => clearTimeout(timer);
  }, [current]);

  const displayMessages = isMobile ? shortMessages : messages;

  return (
    <div className="above-header above-header-slider-container">
      <div
        key={key}
        className="above-header-slider active"
        style={{
          animation: `slide-left ${SLIDE_DURATION / 1000}s linear forwards`,
        }}
        dangerouslySetInnerHTML={{ __html: displayMessages[current] }}
      />
    </div>
  );
};

export default AboveHeader; 