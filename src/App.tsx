import React, { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { FeaturedProducts } from './components/FeaturedProducts';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetail } from './components/ProductDetail';
import { Cart } from './components/Cart';
import { Checkout } from './components/Checkout';
import { Auth } from './components/Auth';
import { Categories } from './components/Categories';
import { OrderSuccess } from './components/OrderSuccess';
import { OrderHistory } from './components/OrderHistory';
import { OrderDetail } from './components/OrderDetail';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { Product } from './types';
import { Toast } from './components/Toast';
import { ProductCard } from './components/ProductCard';

type Page = 'home' | 'products' | 'cart' | 'checkout' | 'auth' | 'categories' | 'product-detail' | 'order-success' | 'order-history' | 'order-detail' | 'about';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' | 'info' } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('');

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
    if (page === 'products') {
      window.scrollTo(0, 0);
    }
    if (page !== 'product-detail') {
      setSelectedProduct(null);
    }
    if (page !== 'products') {
      setSearchQuery('');
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('product-detail');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage('products');
    window.scrollTo(0, 0);
  };

  const handleOrderDetail = (orderId: string) => {
    setSelectedOrderId(orderId);
    setCurrentPage('order-detail');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <Hero onNavigate={handleNavigate} />
            <FeaturedProducts
              onProductClick={handleProductClick}
              onViewAll={() => handleNavigate('products')}
              showToast={showToast}
            />
          </>
        );
      case 'products':
        return (
          <ProductGrid
            onProductClick={handleProductClick}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            showToast={showToast}
          />
        );
      case 'product-detail':
        return selectedProduct ? (
          <ProductDetail
            product={selectedProduct}
            onBack={() => handleNavigate('products')}
            showToast={showToast}
          />
        ) : null;
      case 'cart':
        return (
          <Cart
            onBack={() => handleNavigate('products')}
            onCheckout={() => handleNavigate('checkout')}
            showToast={showToast}
          />
        );
      case 'checkout':
        return (
          <Checkout
            onBack={() => handleNavigate('cart')}
            onOrderComplete={() => handleNavigate('order-success')}
            showToast={showToast}
          />
        );
      case 'auth':
        return <Auth onBack={() => handleNavigate('home')} />;
      case 'categories':
        return (
          <Categories
            onBack={() => handleNavigate('home')}
            onCategorySelect={handleCategorySelect}
          />
        );
      case 'order-success':
        return <OrderSuccess onNavigateHome={() => handleNavigate('home')} />;
      case 'order-history':
        return (
          <OrderHistory
            onBack={() => handleNavigate('home')}
            onOrderDetail={handleOrderDetail}
          />
        );
      case 'order-detail':
        return selectedOrderId ? (
          <OrderDetail
            orderId={selectedOrderId}
            onBack={() => handleNavigate('order-history')}
          />
        ) : null;
      case 'about':
        return (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">About Us</h1>
            <p className="text-gray-600 mb-6">
              Welcome to Nellai Super Market! We are committed to providing fresh groceries and daily essentials to your doorstep. Visit us at our store location below:
            </p>
            <div className="mb-6">
              <iframe
                src="https://maps.google.com/maps?q=https://maps.app.goo.gl/huybLSZKvQD54QtL6&output=embed"
                width="100%"
                height="350"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Nellai Super Market Location"
              ></iframe>
            </div>
            <p className="text-gray-600">
              <a
                href="https://maps.app.goo.gl/huybLSZKvQD54QtL6"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:underline"
              >
                View on Google Maps
              </a>
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <AuthProvider>
      <CartProvider>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header
              onNavigate={handleNavigate}
              onSearch={handleSearch}
              currentPage={currentPage}
            />
            <main className="flex-1">
              {renderPage()}
            </main>
            <Footer onNavigate={handleNavigate} />
            {toast && (
              <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(null)}
              />
            )}
          </div>
        </CartProvider>
    </AuthProvider>
  );
}

export default App;