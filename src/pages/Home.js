import React from 'react';
import HomeHero from '../components/HomeHero';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-content-with-gap">
      <HomeHero />
    </div>
  );
}

export default Home;