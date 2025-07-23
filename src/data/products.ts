import { Product } from '../types';
// Import images for each product (match actual filenames)
import riceImg from '../assets/rice.jpg';
import tomatoImg from '../assets/tomato.jpg';
import oilImg from '../assets/oil.jpg';
import milkImg from '../assets/milk.jpg';
import onionImg from '../assets/onion.jpg';
import flourImg from '../assets/flour.jpg';
import leafImg from '../assets/leaf.jpg';
import turmericImg from '../assets/turmeric.jpg';
import paneerImg from '../assets/panner.jpg';
import fruitImg from '../assets/slideshow3.jpg';

export const products: Product[] = [
  {
    id: 1,
    name: "Premium Basmati Rice",
    price: 299,
    originalPrice: 349,
    image: riceImg,
    category: "Rice & Grains",
    description: "High-quality aged basmati rice with long grains and aromatic fragrance. Perfect for biryanis and special occasions.",
    rating: 4.8,
    inStock: true
  },
  {
    id: 2,
    name: "Fresh Organic Tomatoes",
    price: 45,
    image: tomatoImg,
    category: "Vegetables",
    description: "Farm-fresh organic tomatoes, rich in vitamins and perfect for cooking and salads.",
    rating: 4.6,
    inStock: true
  },
  {
    id: 3,
    name: "Pure Coconut Oil",
    price: 185,
    originalPrice: 220,
    image: oilImg,
    category: "Oils & Spices",
    description: "Cold-pressed pure coconut oil, ideal for cooking and hair care. 100% natural and chemical-free.",
    rating: 4.9,
    inStock: true
  },
  {
    id: 4,
    name: "Fresh Milk",
    price: 28,
    image: milkImg,
    category: "Dairy",
    description: "Fresh daily milk from local dairy farms. Rich in calcium and essential nutrients.",
    rating: 4.7,
    inStock: true
  },
  {
    id: 5,
    name: "Red Onions",
    price: 35,
    image: onionImg,
    category: "Vegetables",
    description: "Fresh red onions, essential for Indian cooking. Great flavor and long shelf life.",
    rating: 4.4,
    inStock: true
  },
  {
    id: 6,
    name: "Whole Wheat Flour",
    price: 68,
    image: flourImg,
    category: "Rice & Grains",
    description: "Freshly ground whole wheat flour, perfect for making rotis, chapatis, and bread.",
    rating: 4.5,
    inStock: true
  },
  {
    id: 7,
    name: "Green Leafy Vegetables Mix",
    price: 25,
    image: leafImg,
    category: "Vegetables",
    description: "Fresh mix of spinach, fenugreek, and other leafy greens. Rich in iron and vitamins.",
    rating: 4.3,
    inStock: true
  },
  {
    id: 8,
    name: "Turmeric Powder",
    price: 95,
    image: turmericImg,
    category: "Oils & Spices",
    description: "Pure turmeric powder with high curcumin content. Essential spice for Indian cuisine and health benefits.",
    rating: 4.8,
    inStock: true
  },
  {
    id: 9,
    name: "Fresh Paneer",
    price: 120,
    image: paneerImg,
    category: "Dairy",
    description: "Fresh homemade paneer, soft and creamy. Perfect for curries and snacks.",
    rating: 4.6,
    inStock: true
  },
  {
    id: 10,
    name: "Mixed Fruit Basket",
    price: 180,
    originalPrice: 220,
    image: fruitImg,
    category: "Fruits",
    description: "Seasonal fresh fruits including apples, bananas, oranges, and grapes. Rich in vitamins and fiber.",
    rating: 4.7,
    inStock: true
  }
];

export const categories = [
  { name: "Vegetables", count: 3, icon: "🥬" },
  { name: "Fruits", count: 1, icon: "🍎" },
  { name: "Rice & Grains", count: 2, icon: "🌾" },
  { name: "Dairy", count: 2, icon: "🥛" },
  { name: "Oils & Spices", count: 2, icon: "🧂" }
];