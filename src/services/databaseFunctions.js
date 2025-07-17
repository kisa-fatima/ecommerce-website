import db from '../firebase';
import { collection, getDocs, doc, updateDoc, addDoc } from 'firebase/firestore';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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

// Add a new product with image upload and category path resolution
export async function handleAddProduct(product) {
  // 1. Upload images to Firebase Storage
  const uploadImage = async (file, path) => {
    if (!file || !file.originFileObj) return '';
    const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file.originFileObj);
    return await getDownloadURL(storageRef);
  };
  const thumbnailUrl = await uploadImage(product.thumbnail, 'product-thumbnails');
  const image1Url = await uploadImage(product.image1, 'product-images');
  const image2Url = await uploadImage(product.image2, 'product-images');
  // 2. Resolve category/style/type names
  let categoryName = '', styleName = '', typeName = '';
  if (product.category) {
    const arr = await getCategoryPathById(product.category);
    categoryName = arr[0] || '';
    styleName = arr[1] || '';
    typeName = arr[2] || '';
  }
  // 3. Add product to Firestore with all required fields
  const productData = {
    category: product.category,
    categoryID: product.categoryId, // Save the deepest category ID as categoryID
    categoryName,
    styleName,
    typeName,
    description: product.description,
    discountFlag: product.discountFlag,
    discountPercentage: product.discountPercentage !== undefined ? product.discountPercentage : null,
    image1: image1Url || '',
    image2: image2Url || '',
    inStock: product.inStock !== undefined ? product.inStock : true,
    name: product.name,
    price: product.price,
    quantity: product.quantity,
    rating: (Math.random() * 2 + 3).toFixed(1),
    soldCount: 0,
    state: true,
    thumbnail: thumbnailUrl || '',
  };
  return await addDoc(collection(db, 'products'), productData);
}

// Update an existing product with image upload and category path resolution
export async function handleUpdateProduct(productId, updatedProduct, existingProduct) {
  // Upload new images if changed, otherwise keep existing URLs
  const uploadImage = async (file, path, existingUrl) => {
    if (!file) return existingUrl || '';
    if (file.originFileObj) {
      const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file.originFileObj);
      return await getDownloadURL(storageRef);
    }
    return file.url || file.thumbUrl || existingUrl || '';
  };
  const thumbnailUrl = await uploadImage(updatedProduct.thumbnail, 'product-thumbnails', existingProduct.thumbnail);
  const image1Url = await uploadImage(updatedProduct.image1, 'product-images', existingProduct.image1);
  const image2Url = await uploadImage(updatedProduct.image2, 'product-images', existingProduct.image2);
  // Resolve category/style/type names
  let categoryName = '', styleName = '', typeName = '';
  if (updatedProduct.category) {
    const arr = await getCategoryPathById(updatedProduct.category);
    categoryName = arr[0] || '';
    styleName = arr[1] || '';
    typeName = arr[2] || '';
  }
  // Update product in Firestore
  const docRef = doc(db, 'products', productId);
  await updateDoc(docRef, {
    name: updatedProduct.name,
    description: updatedProduct.description,
    price: updatedProduct.price,
    quantity: updatedProduct.quantity,
    discountFlag: updatedProduct.discountFlag,
    discountPercentage: updatedProduct.discountPercentage !== undefined ? updatedProduct.discountPercentage : null,
    category: updatedProduct.category,
    type: updatedProduct.type,
    section: updatedProduct.section,
    categoryName,
    styleName,
    typeName,
    thumbnail: thumbnailUrl,
    image1: image1Url,
    image2: image2Url,
    inStock: updatedProduct.inStock !== undefined ? updatedProduct.inStock : true,
  });
}

// Script: Update all products to have categoryName, styleName, typeName fields
export async function updateAllProductsCategoryNames() {
  const productsCol = collection(db, 'products');
  const productSnapshot = await getDocs(productsCol);
  const products = productSnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
  for (const product of products) {
    let categoryName = '', styleName = '', typeName = '';
    if (product.category) {
      const arr = await getCategoryPathById(product.category);
      categoryName = arr[0] || '';
      styleName = arr[1] || '';
      typeName = arr[2] || '';
    }
    const docRef = doc(db, 'products', product.id);
    await updateDoc(docRef, { categoryName, styleName, typeName });
    console.log(`Updated product ${product.id}:`, { categoryName, styleName, typeName });
  }
  alert('All products updated with category/style/type names!');
}