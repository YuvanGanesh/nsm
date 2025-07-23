import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { categories } from '../data/products';

interface CategoriesProps {
  onBack: () => void;
  onCategorySelect: (category: string) => void;
}

export function Categories({ onBack, onCategorySelect }: CategoriesProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-green-600 hover:text-green-700 mb-6 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Home</span>
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Shop by Category</h1>
        <p className="text-gray-600">Discover products organized by category</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => onCategorySelect(category.name)}
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-8 text-center group"
          >
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
              {category.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
            <p className="text-gray-600">
              {category.count} product{category.count !== 1 ? 's' : ''} available
            </p>
            <div className="mt-4 inline-flex items-center text-green-600 font-medium">
              Browse Products →
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}