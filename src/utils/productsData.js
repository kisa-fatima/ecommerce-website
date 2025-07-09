// src/addDummyProducts.js
import { collection, addDoc } from "firebase/firestore";
import db from "../firebase";

const dummyProducts = [
  // 👨 MEN
  {
    title: "Men's White Cotton Shirt",
    category: "men",
    price: 2999,
    description: "Premium white cotton shirt, perfect for formal wear.",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b", 
    inStock: true,
    sizes: ["S", "M", "L", "XL"]
  },
  {
    title: "Men's Blue Denim Jeans",
    category: "men",
    price: 4499,
    description: "Comfort-fit stretchable denim jeans in classic blue.",
    image: "https://images.unsplash.com/photo-1618354691417-48f971f4f656",
    inStock: true,
    sizes: ["30", "32", "34", "36"]
  },

  // 👩 WOMEN
  {
    title: "Women's Summer Floral Dress",
    category: "women",
    price: 3799,
    description: "Lightweight and breezy dress with floral prints.",
    image: "https://images.unsplash.com/photo-1593032465171-d6b62c4b5d29",
    inStock: true,
    sizes: ["XS", "S", "M", "L"]
  },
  {
    title: "Women's Black Leather Jacket",
    category: "women",
    price: 7499,
    description: "Edgy black leather jacket for stylish winter looks.",
    image: "https://images.unsplash.com/photo-1533674689011-17addc9f9c39",
    inStock: false,
    sizes: ["S", "M", "L"]
  },

  // 🧒 KIDS
  {
    title: "Kids' Cartoon T-Shirt",
    category: "kids",
    price: 1499,
    description: "Fun cartoon t-shirt for boys and girls.",
    image: "https://images.unsplash.com/photo-1621861622164-7cf9b8ee3b25",
    inStock: true,
    sizes: ["3-4Y", "5-6Y", "7-8Y"]
  },
  {
    title: "Kids' Hoodie - Pink",
    category: "kids",
    price: 1999,
    description: "Warm hoodie for winter wear with cute bunny design.",
    image: "https://images.unsplash.com/photo-1610585152915-e8ce508de71e",
    inStock: true,
    sizes: ["3-4Y", "5-6Y", "7-8Y", "9-10Y"]
  },
];

export const addProductsToFirestore = async () => {
  try {
    const productsRef = collection(db, "products");
    for (let product of dummyProducts) {
      await addDoc(productsRef, product);
    }
    alert("Dummy products added to Firestore!");
  } catch (error) {
    console.error("Error adding products: ", error);
  }
};
