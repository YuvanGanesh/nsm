import React from 'react';
import { CheckCircle, Package, Clock, Home } from 'lucide-react';

interface OrderSuccessProps {
  onNavigateHome: () => void;
}

export function OrderSuccess({ onNavigateHome }: OrderSuccessProps) {
  const orderNumber = `NSM${Date.now().toString().slice(-6)}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600 text-lg">
              Thank you for shopping with Nellai Super Market
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">Order Details</h2>
            <p className="text-blue-700">
              Order Number: <span className="font-bold">#{orderNumber}</span>
            </p>
            <p className="text-blue-700 text-sm mt-1">
              You will receive a confirmation email shortly
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <Package className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Preparing Order</h3>
                <p className="text-sm text-gray-600">Your items are being prepared</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <Clock className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Delivery Time</h3>
                <p className="text-sm text-gray-600">Same day delivery available</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={onNavigateHome}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Home className="h-5 w-5" />
              <span>Continue Shopping</span>
            </button>

            <p className="text-gray-600 text-sm">
              Need help? Contact us at{' '}
              <a href="tel:+919876543210" className="text-green-600 hover:text-green-700">
                +91 98765 43210
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}