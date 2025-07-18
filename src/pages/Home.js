import React from 'react';
import { useSelector } from 'react-redux';
import HomeHero from '../components/HomeHero';
import '../styles/Home.css';
import BrandLogos from '../components/BrandLogos';
import NewArrivals from '../components/NewArrivals';
import TopSelling from '../components/TopSelling';
import BrowseByStyle from '../components/BrowseByStyle';
import HappyCustomers from '../components/HappyCustomers';

const ADMIN_EMAIL = 'admin123@gmail.com';

const Home = () => {
  // const user = useSelector(state => state.auth.user);
  // const isAdmin = user && user.email === ADMIN_EMAIL;
  return (
    <div>
      <HomeHero />
      <BrandLogos />
      <NewArrivals />
      <TopSelling />
      <BrowseByStyle />
      {/* Center-cropped, horizontally-fitted video with overlay text */}
      <div className="home-vertical-video-wrap">
        <span className="home-video-overlay">SHOP NOW</span>
        <video
          src={process.env.PUBLIC_URL + '/assets/videos/home-video.mp4'}
          autoPlay
          loop
          muted
          playsInline
          className="home-vertical-video"
        />
      </div>
      <HappyCustomers />
    </div>
  );
}

export default Home;