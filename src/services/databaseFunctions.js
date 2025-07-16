import db from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

// Retrieve all products from the 'products' collection
export async function getAllProducts() {
  const productsCol = collection(db, 'products');
  const productSnapshot = await getDocs(productsCol);
  return productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}