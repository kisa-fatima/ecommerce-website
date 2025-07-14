import React from 'react';
import PageBanner from '../components/PageBanner';
import formalPageImg from '../assets/images/formalPage.jpg';

const Formal = () => {
  return (
    <>
      <PageBanner
        image={formalPageImg}
        title="FORMAL"
        description="Elevate your wardrobe with our formal wear collection — tailored to perfection for every occasion. From crisp shirts and sleek trousers to elegant dresses and statement blazers, discover refined styles that command attention. Whether it’s the office, an event, or a special night out, dress the part with confidence."
      />
      {/* Other formal page content can go here */}
    </>
  );
}

export default Formal;