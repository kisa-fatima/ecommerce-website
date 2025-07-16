import db from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

// Retrieve all products from the 'products' collection
export async function getAllProducts() {
  const productsCol = collection(db, 'products');
  const productSnapshot = await getDocs(productsCol);
  return productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Retrieve all categories and build a nested hierarchy
export async function getCategoryHierarchy() {
  const categoriesCol = collection(db, 'categories');
  const categorySnapshot = await getDocs(categoriesCol);
  const flatCategories = categorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // Build a map for quick lookup
  const idToCategory = {};
  flatCategories.forEach(cat => {
    idToCategory[cat.id] = { ...cat, children: [] };
  });

  // Build the hierarchy
  const hierarchy = [];
  flatCategories.forEach(cat => {
    if (!cat.parentID) {
      // Top-level category
      hierarchy.push(idToCategory[cat.id]);
    } else if (idToCategory[cat.parentID]) {
      // Add as child to its parent
      idToCategory[cat.parentID].children.push(idToCategory[cat.id]);
    }
  });

  return hierarchy;
}