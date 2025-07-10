import React from 'react';
import PageBanner from '../components/PageBanner';
import womenImg from '../assets/images/women.jpg';

const Women = () => {
  return (
    <div>
      <PageBanner
        image={womenImg}
        title="Women"
        description="Discover our curated collection of women's fashion designed to empower every style. From breezy summer dresses to bold leather jackets, explore outfits made for work, weekends, and everything in between. Whether you're dressing up or keeping it casual, find the perfect blend of comfort, confidence, and charm."
      />
    </div>
  );
}

export default Women;