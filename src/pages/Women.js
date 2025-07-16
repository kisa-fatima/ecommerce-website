import React from 'react';
import PageBanner from '../components/PageBanner';
import womenImg from '../assets/images/women.jpg';
import TypeSelection from '../components/TypeSelection';
import { useEffect, useState } from 'react';
import { getAllProducts, getAllCategoriesFlat } from '../services/databaseFunctions';
import ProductCard from '../components/ProductCard';
import { useLocation } from 'react-router-dom';

const Women = () => {
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
      // Find the root category ID for Women
      const womenRoot = cats.find(cat => cat.name.toLowerCase() === 'women' && !cat.parentID);
      setWomenRootId(womenRoot ? womenRoot.id : null);
    }
    fetchProductsAndCats();
  }, []);

  const [womenRootId, setWomenRootId] = useState(null);
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const styleId = params.get('style');
    const typeId = params.get('type');
    setFiltered(products.filter(p => {
      if (!p.category) return false;
      const ancestors = catMap[p.category] || [];
      if (typeId) return ancestors.includes(typeId);
      if (styleId) return ancestors.includes(styleId);
      // For root, show all products under Women
      if (womenRootId) return ancestors.includes(womenRootId);
      return false;
    }));
  }, [products, location, catMap, womenRootId]);

  return (
    <div>
      <PageBanner
        image={womenImg}
        title="Women"
        description="Discover our curated collection of women's fashion designed to empower every style. From breezy summer dresses to bold leather jackets, explore outfits made for work, weekends, and everything in between. Whether you're dressing up or keeping it casual, find the perfect blend of comfort, confidence, and charm."
      />
      <TypeSelection rootCategoryName="Women" />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center', marginTop: 24 }}>
        {filtered.map(product => <ProductCard key={product.id} product={product} />)}
      </div>
    </div>
  );
}

export default Women;