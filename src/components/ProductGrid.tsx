import React, { useState, useMemo } from 'react';
import { Search, Filter, SortAsc } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { Product } from '../types';
import { products, categories } from '../data/products';

interface ProductGridProps {
  onProductClick: (product: Product) => void;
  searchQuery?: string;
  selectedCategory?: string;
}

export function ProductGrid({ onProductClick, searchQuery = '', selectedCategory = '', showToast }: ProductGridProps & { showToast?: (msg: string, type?: 'success' | 'error' | 'info') => void }) {
  const [localSelectedCategory, setLocalSelectedCategory] = useState<string>(selectedCategory);
  const [sortBy, setSortBy] = useState<string>('name');
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  // Sync localSelectedCategory with prop
  React.useEffect(() => {
    setLocalSelectedCategory(selectedCategory);
  }, [selectedCategory]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(localSearchQuery.toLowerCase());
      const matchesCategory = !localSelectedCategory || product.category === localSelectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [localSearchQuery, localSelectedCategory, sortBy]);

  // Update local search when prop changes
  React.useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Products</h1>
        <p className="text-gray-600">Fresh groceries and daily essentials at your fingertips</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <select
              value={localSelectedCategory}
              onChange={(e) => setLocalSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.name} value={category.name}>
                  {category.name} ({category.count})
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="relative">
            <SortAsc className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredAndSortedProducts.length} of {products.length} products
          {localSelectedCategory && <span> in {localSelectedCategory}</span>}
          {localSearchQuery && <span> for "{localSearchQuery}"</span>}
        </p>
      </div>

      {/* Product Grid */}
      {filteredAndSortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onProductClick={onProductClick}
              showToast={showToast}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">
            Try adjusting your search criteria or browse all categories
          </p>
          <button
            onClick={() => {
              setLocalSearchQuery('');
              setLocalSelectedCategory('');
            }}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}