import React from 'react';
import PageBanner from '../components/PageBanner';
import menImg from '../assets/images/men.jpg';
import TypeSelection from '../components/TypeSelection';
import { useEffect, useState } from 'react';
import { getAllProducts, getAllCategoriesFlat } from '../services/databaseFunctions';
import ProductCard from '../components/ProductCard';
import { useLocation } from 'react-router-dom';

const Men = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [catMap, setCatMap] = useState({});
  const location = useLocation();

  useEffect(() => {
    async function fetchProductsAndCats() {
      const all = await getAllProducts();
      setProducts(all);
      const cats = await getAllCategoriesFlat();
      // Build a map: categoryId -> [ancestorIds...]
      const idToAncestors = {};
      cats.forEach(cat => {
        let path = [];
        let current = cat;
        while (current) {
          path.unshift(current.id);
          current = cats.find(c => c.id === current.parentID);
        }
        idToAncestors[cat.id] = path;
      });
      setCatMap(idToAncestors);
      // Find the root category ID for Men
      const menRoot = cats.find(cat => cat.name.toLowerCase() === 'men' && !cat.parentID);
      setMenRootId(menRoot ? menRoot.id : null);
    }
    fetchProductsAndCats();
  }, []);

  const [menRootId, setMenRootId] = useState(null);
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const styleId = params.get('style');
    const typeId = params.get('type');
    setFiltered(products.filter(p => {
      if (!p.category) return false;
      const ancestors = catMap[p.category] || [];
      if (typeId) return ancestors.includes(typeId);
      if (styleId) return ancestors.includes(styleId);
      // For root, show all products under Men
      if (menRootId) return ancestors.includes(menRootId);
      return false;
    }));
  }, [products, location, catMap, menRootId]);

  return (
    <div>
      <PageBanner
        image={menImg}
        title="MEN"
        description="Step up your wardrobe with our curated men’s collection — from sharp shirts and classic denim to laid-back tees and cozy essentials. Whether it’s work, weekends, or workouts, find high-quality pieces designed for comfort, durability, and timeless style."
      />
      <TypeSelection rootCategoryName="Men" />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center', marginTop: 24 }}>
        {filtered.map(product => <ProductCard key={product.id} product={product} />)}
      </div>
    </div>
  );
}

export default Men;