import React from 'react';
import PageBanner from '../components/PageBanner';
import kidsImg from '../assets/images/kids.jpg';
import TypeSelection from '../components/TypeSelection';
import { useEffect, useState } from 'react';
import { getAllProducts, getAllCategoriesFlat } from '../services/databaseFunctions';
import ProductCard from '../components/ProductCard';
import { useLocation } from 'react-router-dom';

const Kids = () => {
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
      // Find the root category ID for Kids
      const kidsRoot = cats.find(cat => cat.name.toLowerCase() === 'kids' && !cat.parentID);
      setKidsRootId(kidsRoot ? kidsRoot.id : null);
    }
    fetchProductsAndCats();
  }, []);

  const [kidsRootId, setKidsRootId] = useState(null);
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const styleId = params.get('style');
    const typeId = params.get('type');
    setFiltered(products.filter(p => {
      if (!p.category) return false;
      const ancestors = catMap[p.category] || [];
      if (typeId) return ancestors.includes(typeId);
      if (styleId) return ancestors.includes(styleId);
      // For root, show all products under Kids
      if (kidsRootId) return ancestors.includes(kidsRootId);
      return false;
    }));
  }, [products, location, catMap, kidsRootId]);

  return (
    <div>
      <PageBanner
        image={kidsImg}
        title="KIDS"
        description="Make every day an adventure with our adorable kids’ collection! From colorful t-shirts to cozy hoodies, we’ve got outfits made for play, parties, and everything in between. Soft fabrics, fun prints, and comfy fits — perfect for growing kids with big imaginations."
      />
      <TypeSelection rootCategoryName="Kids" />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center', marginTop: 24 }}>
        {filtered.map(product => <ProductCard key={product.id} product={product} />)}
      </div>
    </div>
  );
}

export default Kids;