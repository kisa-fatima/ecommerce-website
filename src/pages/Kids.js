import React from 'react';
import PageBanner from '../components/PageBanner';
import kidsImg from '../assets/images/kids.jpg';

const Kids = () => {
  return (
    <div>
      <PageBanner
        image={kidsImg}
        title="KIDS"
        description="Make every day an adventure with our adorable kids’ collection! From colorful t-shirts to cozy hoodies, we’ve got outfits made for play, parties, and everything in between. Soft fabrics, fun prints, and comfy fits — perfect for growing kids with big imaginations."
      />
    </div>
  );
}

export default Kids;