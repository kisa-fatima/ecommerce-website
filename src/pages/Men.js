import React from 'react';
import PageBanner from '../components/PageBanner';
import menImg from '../assets/images/men.jpg';

const Men = () => {
  return (
    <div>
      <PageBanner
        image={menImg}
        title="MEN"
        description="Step up your wardrobe with our curated men’s collection — from sharp shirts and classic denim to laid-back tees and cozy essentials. Whether it’s work, weekends, or workouts, find high-quality pieces designed for comfort, durability, and timeless style."
      />
    </div>
  );
}

export default Men;