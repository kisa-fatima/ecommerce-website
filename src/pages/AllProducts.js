import React, { useEffect } from 'react';
import PageBanner from '../components/PageBanner';
import allProductsImg from '../assets/images/allProducts.jpg';

const AllProducts = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <PageBanner
        image={allProductsImg}
        title="ALL PRODUCTS"
        description="Browse our full collection of fashion-forward clothing for men, women, and kids. From everyday basics to statement pieces, explore stylish and comfortable outfits for every age, mood, and moment. Quality fabrics, modern fits, and fresh designs — all in one place, just for you."
      />
    </div>
  );
}

export default AllProducts;