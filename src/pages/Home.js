import React from 'react';
import HomeHero from '../components/HomeHero';
import '../styles/Home.css';
import BrandLogos from '../components/BrandLogos';

const Home = () => {
  return (
    <div className="home-content-with-gap">
      <HomeHero />
      <BrandLogos />
    </div>
  );
}

export default Home;