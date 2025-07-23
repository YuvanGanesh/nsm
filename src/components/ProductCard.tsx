import React from 'react';
import { Star, ShoppingCart, IndianRupee } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
}

export function ProductCard({ product, onProductClick, showToast }: ProductCardProps & { showToast?: (msg: string, type?: 'success' | 'error' | 'info') => void }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    if (showToast) showToast('Added to cart!', 'success');
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
      onClick={() => onProductClick(product)}
    >
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.originalPrice && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            Save ₹{product.originalPrice - product.price}
          </div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold bg-red-600 px-3 py-1 rounded-lg">Out of Stock</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
            {product.category}
          </span>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-gray-600">{product.rating}</span>
          </div>
        </div>
        
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center text-lg font-bold text-gray-900">
              <IndianRupee className="h-4 w-4" />
              {product.price}
            </div>
            {product.originalPrice && (
              <div className="flex items-center text-sm text-gray-500 line-through">
                <IndianRupee className="h-3 w-3" />
                {product.originalPrice}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`${
                product.inStock
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              } px-3 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-1`}
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="text-sm font-medium">Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}