import React from 'react';
import HomeHero from '../components/HomeHero';
import '../styles/Home.css';
import BrandLogos from '../components/BrandLogos';
import NewArrivals from '../components/NewArrivals';
import TopSelling from '../components/TopSelling';
import BrowseByStyle from '../components/BrowseByStyle';
import HappyCustomers from '../components/HappyCustomers';

const Home = () => {
  return (
    <div>
      <HomeHero />
      <BrandLogos />
      <NewArrivals />
      <TopSelling />
      <BrowseByStyle />
      <HappyCustomers />
    </div>
  );
}

export default Home;