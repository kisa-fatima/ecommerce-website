import React from 'react';
import HomeHero from '../components/HomeHero';
<<<<<<< HEAD
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-content-with-gap">
      <HomeHero />
=======
import BrandLogos from '../components/BrandLogos';

const Home = () => {
  return (
    <div>
      <HomeHero />
      <BrandLogos />
>>>>>>> 123f2211e41b162590c8115ee1c41b65c1524088
    </div>
  );
}

export default Home;