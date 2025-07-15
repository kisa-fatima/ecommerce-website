import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Standard scroll to top
    window.scrollTo(0, 0);
    // Fallback for some mobile browsers
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    // Extra: delay for mobile browsers that ignore immediate scroll
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }, 50);
  }, [pathname]);

  return null;
};

export default ScrollToTop; 