import React from 'react';
import PageBanner from '../components/PageBanner';
import partyPageImg from '../assets/images/partyPage.jpg';
import CategorySelectorSection from '../components/CategorySelectorSection';

const Party = () => {
  return (
    <>
      <PageBanner
        image={partyPageImg}
        title="PARTY"
        description="Get ready to turn heads with our bold and glamorous party wear collection. From dazzling dresses and sharp suits to shimmer tops and standout accessories, find everything you need to light up the night. Whether it’s a wedding, birthday bash, or festive celebration — show up in style and steal the spotlight."
      />
      <CategorySelectorSection styleName="Party" productCount={0} />
      {/* Other party page content can go here */}
    </>
  );
}

export default Party;