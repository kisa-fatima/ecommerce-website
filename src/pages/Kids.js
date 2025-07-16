import React, { useEffect, useState } from 'react';
import PageBanner from '../components/PageBanner';
import kidsImg from '../assets/images/kids.jpg';
import TypeSelection from '../components/TypeSelection';
import { getAllProducts, getAllCategoriesFlat } from '../services/databaseFunctions';
import ProductCard from '../components/ProductCard';
import { useLocation } from 'react-router-dom';

const Kids = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [catMap, setCatMap] = useState({});
  const [catIdToName, setCatIdToName] = useState({});
  const location = useLocation();
  const [kidsRootId, setKidsRootId] = useState(null);

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
      // Find the root category ID for Kids
      const kidsRoot = cats.find(cat => cat.name.toLowerCase() === 'kids' && !cat.parentID);
      setKidsRootId(kidsRoot ? kidsRoot.id : null);
    }
    fetchProductsAndCats();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const styleId = params.get('style');
    const typeId = params.get('type');
    setFiltered(products.filter(p => {
      if (!p.categoryID) return false;
      const ancestors = catMap[p.categoryID] || [];
      // If All (no style selected) and a type name is selected, match by type name
      if ((!styleId || styleId === 'all') && typeId && typeId !== 'all') {
        return catIdToName[p.categoryID] && catIdToName[p.categoryID].toLowerCase() === typeId.toLowerCase();
      }
      if (typeId && typeId !== 'all') return ancestors.includes(typeId);
      if (styleId && styleId !== 'all') return ancestors.includes(styleId);
      // For root, show all products under Kids
      if (kidsRootId) return ancestors.includes(kidsRootId);
      return false;
    }));
  }, [products, location, catMap, kidsRootId, catIdToName]);

  return (
    <div>
      <PageBanner
        image={kidsImg}
        title="Kids"
        description="Discover our curated collection of kids' fashion for every adventure. From playful tees to cozy hoodies, find outfits that keep up with their energy and imagination."
      />
      <TypeSelection rootCategoryName="Kids" />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center', marginTop: 24 }}>
        {filtered.map(product => <ProductCard key={product.id} product={product} />)}
      </div>
    </div>
  );
}

export default Kids;