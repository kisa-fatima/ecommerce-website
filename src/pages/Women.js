import React, { useEffect, useState } from 'react';
import PageBanner from '../components/PageBanner';
import womenImg from '../assets/images/women.jpg';
import ProductCard from '../components/ProductCard';
import { getAllProducts } from '../services/databaseFunctions';

const Women = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const data = await getAllProducts();
        // Filter for products where category name is 'Women' (resolve root category)
        const womenProducts = data.filter(p => p.categoryName && p.categoryName.toLowerCase() === 'women');
        setProducts(womenProducts);
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
        image={womenImg}
        title="Women"
        description="Discover our curated collection of women's fashion designed to empower every style. From breezy summer dresses to bold leather jackets, explore outfits made for work, weekends, and everything in between. Whether you're dressing up or keeping it casual, find the perfect blend of comfort, confidence, and charm."
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

export default Women;