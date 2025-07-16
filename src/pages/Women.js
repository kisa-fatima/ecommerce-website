import React, { useEffect, useState } from 'react';
import PageBanner from '../components/PageBanner';
import womenImg from '../assets/images/women.jpg';
import TypeSelection from '../components/TypeSelection';
import { getAllProducts, getAllCategoriesFlat } from '../services/databaseFunctions';
import ProductCard from '../components/ProductCard';
import { useLocation } from 'react-router-dom';

const Women = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [catMap, setCatMap] = useState({});
  const [catIdToName, setCatIdToName] = useState({});
  const location = useLocation();
  const [womenRootId, setWomenRootId] = useState(null);

  useEffect(() => {
    async function fetchProductsAndCats() {
      const all = await getAllProducts();
      setProducts(all);
      const cats = await getAllCategoriesFlat();
      // Build a map: categoryId -> [ancestorIds...]
      const idToAncestors = {};
      const idToName = {};
      cats.forEach(cat => {
        let path = [];
        let current = cat;
        while (current) {
          path.unshift(current.id);
          current = cats.find(c => c.id === current.parentID);
        }
        idToAncestors[cat.id] = path;
        idToName[cat.id] = cat.name;
      });
      setCatMap(idToAncestors);
      setCatIdToName(idToName);
      // Find the root category ID for Women
      const womenRoot = cats.find(cat => cat.name.toLowerCase() === 'women' && !cat.parentID);
      setWomenRootId(womenRoot ? womenRoot.id : null);
    }
    fetchProductsAndCats();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const styleId = params.get('style');
    const typeId = params.get('type');
    setFiltered(products.filter(p => {
      if (!p.category) return false;
      const ancestors = catMap[p.category] || [];
      // If All (no style selected) and a type name is selected, match by type name
      if ((!styleId || styleId === 'all') && typeId && typeId !== 'all') {
        return catIdToName[p.category] && catIdToName[p.category].toLowerCase() === typeId.toLowerCase();
      }
      if (typeId && typeId !== 'all') return ancestors.includes(typeId);
      if (styleId && styleId !== 'all') return ancestors.includes(styleId);
      // For root, show all products under Women
      if (womenRootId) return ancestors.includes(womenRootId);
      return false;
    }));
  }, [products, location, catMap, womenRootId, catIdToName]);

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