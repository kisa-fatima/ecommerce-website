import React from 'react';
import PageBanner from '../components/PageBanner';
import gymPageImg from '../assets/images/gymPage.jpg';

const Gym = () => {
  return (
    <>
      <PageBanner
        image={gymPageImg}
        title="GYM"
        description="Power through every workout with our high-performance gym wear collection. From breathable tees and sweat-wicking leggings to supportive sports bras and flexible joggers — gear up with styles designed to move with you. Whether you're lifting, running, or stretching, our activewear delivers comfort, durability, and motivation in every rep."
      />
      {/* Other gym page content can go here */}
    </>
  );
}

export default Gym;