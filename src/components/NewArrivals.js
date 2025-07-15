import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import '../styles/NewArrivals.css';

const products = [
  {
    name: 'T-shirt with Tape Details',
    description: 'A stylish t-shirt with unique tape details for a modern look.',
    price: 120,
    image: 'https://images.pexels.com/photos/32936114/pexels-photo-32936114.jpeg',
    discountFlag: false,
    discountPercentage: null,
    thumbnail: 'https://images.pexels.com/photos/32936114/pexels-photo-32936114.jpeg',
    image1: 'https://images.pexels.com/photos/32936114/pexels-photo-32936114.jpeg',
    image2: 'https://images.pexels.com/photos/32936114/pexels-photo-32936114.jpeg',
    image3: 'https://images.pexels.com/photos/32936114/pexels-photo-32936114.jpeg',
    quantity: 10,
    inStock: true,
    category: 'men',
    state: true, // visible
  },
  {
    name: 'Skinny Fit Jeans',
    description: 'Comfortable skinny fit jeans for everyday wear.',
    price: 300,
    image: 'https://via.placeholder.com/120x120?text=Jeans',
    discountFlag: true,
    discountPercentage: 10,
    thumbnail: 'https://via.placeholder.com/60x60?text=Jeans',
    image1: 'https://via.placeholder.com/120x120?text=Jeans',
    image2: 'https://via.placeholder.com/300x300?text=Jeans+Side',
    image3: 'https://via.placeholder.com/300x300?text=Jeans+Back',
    quantity: 5,
    inStock: true,
    category: 'men',
    state: true, // visible
  },
  {
    name: 'Checkered Shirt',
    description: 'Classic checkered shirt for a timeless style.',
    price: 180,
    image: 'https://via.placeholder.com/120x120?text=Shirt',
    discountFlag: false,
    discountPercentage: null,
    thumbnail: 'https://via.placeholder.com/60x60?text=Shirt',
    image1: 'https://via.placeholder.com/120x120?text=Shirt',
    image2: 'https://via.placeholder.com/300x300?text=Shirt+Side',
    image3: 'https://via.placeholder.com/300x300?text=Shirt+Back',
    quantity: 8,
    inStock: true,
    category: 'men',
    state: true, // visible
  },
  {
    name: 'Sleeve Striped T-shirt',
    description: 'Trendy striped t-shirt with comfortable sleeves.',
    price: 180,
    image: 'https://via.placeholder.com/120x120?text=Striped+T-shirt',
    discountFlag: true,
    discountPercentage: 20,
    thumbnail: 'https://via.placeholder.com/60x60?text=Striped+T-shirt',
    image1: 'https://via.placeholder.com/120x120?text=Striped+T-shirt',
    image2: 'https://via.placeholder.com/300x300?text=Striped+T-shirt+Side',
    image3: 'https://via.placeholder.com/300x300?text=Striped+T-shirt+Back',
    quantity: 0,
    inStock: false,
    category: 'men',
    state: true, // invisible
  },
];

const NewArrivals = () => {
  const navigate = useNavigate();
  return (
    <section className="new-arrivals-section">
      <h2 className="new-arrivals-title">NEW ARRIVALS</h2>
      <div className="new-arrivals-row">
        {products.map((product, idx) => (
          <ProductCard key={idx} product={product} />
        ))}
      </div>
      <button className="new-arrivals-viewall" onClick={() => navigate('/all-products')}>View All</button>
    </section>
  );
};

export default NewArrivals; 