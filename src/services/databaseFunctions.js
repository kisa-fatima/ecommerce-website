import db from '../firebase';
import { collection, getDocs, doc, updateDoc, addDoc, deleteDoc, query, where } from 'firebase/firestore';
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
export async function handleAddProduct(formValues) {
  // 1. Upload images to Firebase Storage
  const uploadImage = async (file, path) => {
    if (!file || !file.originFileObj) return '';
    const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file.originFileObj);
    return await getDownloadURL(storageRef);
  };
  const thumbnailUrl = await uploadImage(formValues.thumbnail, 'product-thumbnails');
  const image1Url = await uploadImage(formValues.image1, 'product-images');
  const image2Url = await uploadImage(formValues.image2, 'product-images');
  // 2. Resolve category/style/type names
  let categoryName = '', styleName = '', typeName = '';
  const categoryId = formValues.grandchildCategory || formValues.childCategory || formValues.rootCategory;
  if (categoryId) {
    const arr = await getCategoryPathById(categoryId);
    categoryName = arr[0] || '';
    styleName = arr[1] || '';
    typeName = arr[2] || '';
  }
  // 3. Add product to Firestore with all required fields
  const productData = {
    category: formValues.rootCategory,
    categoryID: categoryId,
    categoryName,
    styleName,
    typeName,
    type: formValues.childCategory,
    section: formValues.grandchildCategory,
    description: formValues.description,
    discountFlag: formValues.discountFlag,
    discountPercentage: formValues.discountPercentage !== undefined ? formValues.discountPercentage : null,
    image1: image1Url || '',
    image2: image2Url || '',
    inStock: formValues.inStock !== undefined ? formValues.inStock : true,
    name: formValues.name,
    price: formValues.price,
    quantity: formValues.quantity,
    rating: (Math.random() * 2 + 3).toFixed(1),
    soldCount: 0,
    state: formValues.state !== undefined ? formValues.state : true,
    thumbnail: thumbnailUrl || '',
  };
  return await addDoc(collection(db, 'products'), productData);
}

// Update an existing product with image upload and category path resolution
export async function handleUpdateProduct(productId, formValues, existingProduct) {
  // Always use existing images if new ones are not provided
  const uploadImage = async (file, path, existingUrl) => {
    if (!file && existingUrl) return existingUrl;
    if (!file) return '';
    if (file.originFileObj) {
      const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file.originFileObj);
      return await getDownloadURL(storageRef);
    }
    return file.url || file.thumbUrl || existingUrl || '';
  };
  const thumbnailUrl = await uploadImage(
    formValues.thumbnail !== undefined ? formValues.thumbnail : existingProduct.thumbnail,
    'product-thumbnails',
    existingProduct.thumbnail
  );
  const image1Url = await uploadImage(
    formValues.image1 !== undefined ? formValues.image1 : existingProduct.image1,
    'product-images',
    existingProduct.image1
  );
  const image2Url = await uploadImage(
    formValues.image2 !== undefined ? formValues.image2 : existingProduct.image2,
    'product-images',
    existingProduct.image2
  );
  // Only update allowed fields
  const docRef = doc(db, 'products', productId);
  await updateDoc(docRef, {
    name: formValues.name,
    description: formValues.description,
    price: formValues.price,
    quantity: formValues.quantity,
    discountFlag: formValues.discountFlag,
    discountPercentage: formValues.discountPercentage !== undefined ? formValues.discountPercentage : null,
    inStock: formValues.inStock !== undefined ? formValues.inStock : true,
    state: formValues.state !== undefined ? formValues.state : true,
    thumbnail: thumbnailUrl,
    image1: image1Url,
    image2: image2Url,
    // Do NOT update category, type, or section
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

/**
 * Adds a new category to the Firestore database.
 * @param {string} name - The name of the new category.
 * @param {string|number|null} parentID - The parent category's ID, or 0/null for root.
 * @returns {Promise<string>} The ID of the created Firestore document.
 */
export async function addCategoryToDatabase(name, parentID) {
  try {
    const { addDoc, collection } = await import('firebase/firestore');
    const { default: db } = await import('../firebase');
    const docRef = await addDoc(collection(db, 'categories'), {
      name,
      parentID: parentID === 0 ? null : parentID,
      state: true,
    });
    return docRef.id;
  } catch (err) {
    console.error('Error adding category:', err);
    throw err;
  }
}

/**
 * Updates the name of a category in the Firestore database.
 * @param {string} categoryId - The ID of the category to update.
 * @param {string} newName - The new name for the category.
 * @returns {Promise<void>}
 */
export async function updateCategoryNameInDatabase(categoryId, newName) {
  try {
    const { doc, updateDoc } = await import('firebase/firestore');
    const { default: db } = await import('../firebase');
    const docRef = doc(db, 'categories', categoryId);
    await updateDoc(docRef, { name: newName });
  } catch (err) {
    console.error('Error updating category name:', err);
    throw err;
  }
}

/**
 * Deletes a category from the Firestore database.
 * @param {string} categoryId - The ID of the category to delete.
 * @returns {Promise<void>}
 */
export async function deleteCategoryFromDatabase(categoryId) {
  try {
    const { doc, deleteDoc } = await import('firebase/firestore');
    const { default: db } = await import('../firebase');
    const docRef = doc(db, 'categories', categoryId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error deleting category:', err);
    throw err;
  }
}

/**
 * Fetch a user document by email from the 'users' collection.
 * @param {string} email - The user's email address.
 * @returns {Promise<{id: string, data: object} | null>} The user document and data, or null if not found.
 */
export async function fetchUserByEmail(email) {
  if (!email) return null;
  const usersRef = collection(db, 'users');
  // Use query to match email
  const q = query(usersRef, where('email', '==', email));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const docSnap = querySnapshot.docs[0];
    return { id: docSnap.id, data: docSnap.data() };
  }
  return null;
}

// Delete a product by ID
export async function deleteProductById(productId) {
  const docRef = doc(db, 'products', productId);
  await deleteDoc(docRef);
}