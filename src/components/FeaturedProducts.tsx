import React from 'react';
import { ProductCard } from './ProductCard';
import { Product } from '../types';
import { products } from '../data/products';

interface FeaturedProductsProps {
  onProductClick: (product: Product) => void;
  onViewAll: () => void;
}

export function FeaturedProducts({ onProductClick, onViewAll, showToast }: FeaturedProductsProps & { showToast?: (msg: string, type?: 'success' | 'error' | 'info') => void }) {
  const featuredProducts = products.filter(product => product.originalPrice).slice(0, 4);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium products at special prices
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {featuredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onProductClick={onProductClick}
              showToast={showToast}
            />
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={onViewAll}
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transform hover:scale-105 transition-all duration-200 font-semibold"
          >
            View All Products
          </button>
        </div>
      </div>
    </section>
  );
}