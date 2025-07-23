import React, { useState } from 'react';
import { Star, ShoppingCart, ArrowLeft, IndianRupee, Plus, Minus } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
}

export function ProductDetail({ product, onBack, showToast }: ProductDetailProps & { showToast?: (msg: string, type?: 'success' | 'error' | 'info') => void }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart, cartItems } = useCart();

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setQuantity(1);
    if (showToast) showToast('Added to cart!', 'success');
  };

  const currentCartQuantity = cartItems.find(item => item.id === product.id)?.quantity || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-green-600 hover:text-green-700 mb-6 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Products</span>
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-96 lg:h-full object-cover"
            />
            {product.originalPrice && (
              <div className="absolute top-4 left-4 bg-red-500 text-white text-sm px-3 py-1 rounded-full">
                Save ₹{product.originalPrice - product.price}
              </div>
            )}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="text-white text-xl font-semibold bg-red-600 px-6 py-3 rounded-lg">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="p-6 lg:p-8">
            <div className="mb-4">
              <span className="inline-block bg-blue-100 text-blue-600 text-sm px-3 py-1 rounded-full">
                {product.category}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="text-lg font-medium">{product.rating}</span>
                <span className="text-gray-600">(4.8/5)</span>
              </div>
              <div className="h-4 w-px bg-gray-300"></div>
              <span className={`text-sm font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            <div className="mb-6">
              <div className="flex items-center space-x-3">
                <div className="flex items-center text-3xl font-bold text-gray-900">
                  <IndianRupee className="h-6 w-6" />
                  {product.price}
                </div>
                {product.originalPrice && (
                  <div className="flex items-center text-xl text-gray-500 line-through">
                    <IndianRupee className="h-4 w-4" />
                    {product.originalPrice}
                  </div>
                )}
                {product.originalPrice && (
                  <span className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded-full">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                )}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {currentCartQuantity > 0 && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-blue-700 text-sm">
                  You already have {currentCartQuantity} of this item in your cart
                </p>
              </div>
            )}

            {product.inStock && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Quantity</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-gray-50 transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-2 font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 hover:bg-gray-50 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="text-gray-600">
                    Total: <span className="font-semibold">₹{product.price * quantity}</span>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
                product.inStock
                  ? 'bg-green-600 hover:bg-green-700 text-white transform hover:scale-[1.02]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <ShoppingCart className="h-5 w-5" />
              <span>
                {product.inStock ? `Add ${quantity} to Cart` : 'Out of Stock'}
              </span>
            </button>

            {product.inStock && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Free delivery on orders above ₹500
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}