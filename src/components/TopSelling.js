import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import '../styles/NewArrivals.css';

const products = [
  {
    name: 'Vertical Striped Shirt',
    description: 'A stylish vertical striped shirt for a modern look.',
    price: 212,
    image: 'https://via.placeholder.com/120x120?text=Striped+Shirt',
    discountFlag: true,
    discountPercentage: 20,
    thumbnail: 'https://via.placeholder.com/60x60?text=Striped+Shirt',
    image1: 'https://via.placeholder.com/120x120?text=Striped+Shirt',
    image2: 'https://via.placeholder.com/300x300?text=Striped+Shirt+Side',
    image3: 'https://via.placeholder.com/300x300?text=Striped+Shirt+Back',
    quantity: 12,
    inStock: true,
    category: 'men',
    state: true,
  },
  {
    name: 'Courage Graphic T-shirt',
    description: 'A bold graphic t-shirt for everyday wear.',
    price: 145,
    image: 'https://via.placeholder.com/120x120?text=Graphic+T-shirt',
    discountFlag: false,
    discountPercentage: null,
    thumbnail: 'https://via.placeholder.com/60x60?text=Graphic+T-shirt',
    image1: 'https://via.placeholder.com/120x120?text=Graphic+T-shirt',
    image2: 'https://via.placeholder.com/300x300?text=Graphic+T-shirt+Side',
    image3: 'https://via.placeholder.com/300x300?text=Graphic+T-shirt+Back',
    quantity: 7,
    inStock: true,
    category: 'men',
    state: true,
  },
  {
    name: 'Loose Fit Bermuda Shorts',
    description: 'Comfortable loose fit Bermuda shorts for summer.',
    price: 80,
    image: 'https://via.placeholder.com/120x120?text=Bermuda+Shorts',
    discountFlag: false,
    discountPercentage: null,
    thumbnail: 'https://via.placeholder.com/60x60?text=Bermuda+Shorts',
    image1: 'https://via.placeholder.com/120x120?text=Bermuda+Shorts',
    image2: 'https://via.placeholder.com/300x300?text=Bermuda+Shorts+Side',
    image3: 'https://via.placeholder.com/300x300?text=Bermuda+Shorts+Back',
    quantity: 0,
    inStock: false,
    category: 'men',
    state: true,
  },
  {
    name: 'Faded Skinny Jeans',
    description: 'Trendy faded skinny jeans for a casual look.',
    price: 210,
    image: 'https://via.placeholder.com/120x120?text=Skinny+Jeans',
    discountFlag: false,
    discountPercentage: null,
    thumbnail: 'https://via.placeholder.com/60x60?text=Skinny+Jeans',
    image1: 'https://via.placeholder.com/120x120?text=Skinny+Jeans',
    image2: 'https://via.placeholder.com/300x300?text=Skinny+Jeans+Side',
    image3: 'https://via.placeholder.com/300x300?text=Skinny+Jeans+Back',
    quantity: 3,
    inStock: true,
    category: 'men',
    state: true,
  },
];

const TopSelling = () => {
  const navigate = useNavigate();
  return (
    <section className="new-arrivals-section">
      <h2 className="new-arrivals-title">TOP SELLING</h2>
      <div className="new-arrivals-row">
        {products.map((product, idx) => (
          <ProductCard key={idx} product={product} />
        ))}
      </div>
      <button className="new-arrivals-viewall" onClick={() => navigate('/all-products')}>View All</button>
    </section>
  );
};

export default TopSelling; 