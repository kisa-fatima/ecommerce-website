import React, { useEffect, useState } from 'react';
import PageBanner from '../components/PageBanner';
import kidsImg from '../assets/images/kids.jpg';
import ProductCard from '../components/ProductCard';
import { getAllProducts } from '../services/databaseFunctions';

const Kids = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const data = await getAllProducts();
        // Filter for products where category name is 'Kids' (resolve root category)
        const kidsProducts = data.filter(p => p.categoryName && p.categoryName.toLowerCase() === 'kids');
        setProducts(kidsProducts);
      } catch (err) {
        setProducts([]);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  return (
    <div>
      <PageBanner
        image={kidsImg}
        title="Kids"
        description="Discover our curated collection of kids' fashion for every adventure. From playful tees to cozy hoodies, find outfits that keep up with their energy and imagination."
      />
      <div style={{ maxWidth: 1200, margin: '32px auto', padding: '0 16px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>Loading products...</div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40 }}>No products found.</div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Kids;