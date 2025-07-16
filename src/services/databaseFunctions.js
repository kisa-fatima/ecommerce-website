import db from '../firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

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

// Given a category ID, return the full path from root to that category as an array of category names
export async function getCategoryPathById(categoryId) {
  const categoriesCol = collection(db, 'categories');
  const categorySnapshot = await getDocs(categoriesCol);
  const flatCategories = categorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  const idToCategory = {};
  flatCategories.forEach(cat => {
    idToCategory[cat.id] = { ...cat };
  });
  let path = [];
  let current = idToCategory[categoryId];
  while (current) {
    path.unshift(current.name);
    if (!current.parentID) break;
    current = idToCategory[current.parentID];
  }
  return path;
}

// Given a category ID, return the full path from root to that category as an array of IDs
export async function getCategoryPathIdsById(categoryId) {
  const categoriesCol = collection(db, 'categories');
  const categorySnapshot = await getDocs(categoriesCol);
  const flatCategories = categorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  const idToCategory = {};
  flatCategories.forEach(cat => {
    idToCategory[cat.id] = { ...cat };
  });
  let path = [];
  let current = idToCategory[categoryId];
  while (current) {
    path.unshift(current.id);
    if (!current.parentID) break;
    current = idToCategory[current.parentID];
  }
  return path;
}

// Get all categories as a flat array
export async function getAllCategoriesFlat() {
  const categoriesCol = collection(db, 'categories');
  const categorySnapshot = await getDocs(categoriesCol);
  return categorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Script: Update all products to have categoryName, typeName, sectionName fields
export async function updateAllProductsCategoryNames() {
  const productsCol = collection(db, 'products');
  const productSnapshot = await getDocs(productsCol);
  const products = productSnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
  for (const product of products) {
    let categoryName = '', typeName = '', sectionName = '';
    if (product.category) {
      const arr = await getCategoryPathById(product.category);
      categoryName = arr[arr.length - 1] || '';
    }
    if (product.type) {
      const arr = await getCategoryPathById(product.type);
      typeName = arr[arr.length - 1] || '';
    }
    if (product.section) {
      const arr = await getCategoryPathById(product.section);
      sectionName = arr[arr.length - 1] || '';
    }
    const docRef = doc(db, 'products', product.id);
    await updateDoc(docRef, { categoryName, typeName, sectionName });
    console.log(`Updated product ${product.id}:`, { categoryName, typeName, sectionName });
  }
  alert('All products updated with category/type/section names!');
}