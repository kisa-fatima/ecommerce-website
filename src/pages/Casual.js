import React, { useEffect } from 'react';
import PageBanner from '../components/PageBanner';
import casualPageImg from '../assets/images/casualPage.jpg';
import CategorySelectorSection from '../components/CategorySelectorSection';

const casual = () => {

  return (
    <>
      <PageBanner
        image={casualPageImg}
        title="CASUAL"
        description="Keep it cool and effortless with our casual wear collection. From soft tees and comfy joggers to easy-going dresses and laid-back layers, explore outfits designed for daily comfort and style. Perfect for hanging out, running errands, or just chilling — casual has never looked this good."
      />
      <CategorySelectorSection styleName="Casual" productCount={0} />
      {/* Other casual page content can go here */}
    </>
  );
}

export default casual;