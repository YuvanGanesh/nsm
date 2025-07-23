import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Smartphone, Truck, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { OrderService } from '../services/orderService';
import { CheckoutForm } from '../types';

interface CheckoutProps {
  onBack: () => void;
  onOrderComplete: () => void;
}

// Add Razorpay script loader
function loadRazorpayScript() {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = resolve;
    document.body.appendChild(script);
  });
}

export function Checkout({ onBack, onOrderComplete, showToast }: CheckoutProps & { showToast?: (msg: string, type?: 'success' | 'error' | 'info') => void }) {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { user, supabaseUser } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<CheckoutForm>({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    paymentMethod: 'card'
  });
  const [isPaying, setIsPaying] = useState(false);

  const deliveryFee = getTotalPrice() >= 500 ? 0 : 1;
  const finalTotal = getTotalPrice() + deliveryFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    setError('');
    setIsProcessing(true);

    try {
      if (supabaseUser) {
        // Use Supabase for real order processing
        const customer = await OrderService.createOrGetCustomer(
          supabaseUser.email || formData.email,
          `${formData.firstName} ${formData.lastName}`,
          formData.phone
        );

        const { order, payment } = await OrderService.createOrder(
          customer.id,
          cartItems,
          formData,
          getTotalPrice(),
          deliveryFee
        );

        console.log('Order created successfully:', { order, payment });
        
        // Clear cart and complete order
        clearCart();
        if (showToast) showToast('Order placed successfully!', 'success');
        onOrderComplete();
      } else {
        // Fallback to mock processing for demo
        await new Promise(resolve => setTimeout(resolve, 2000));
        clearCart();
        if (showToast) showToast('Order placed successfully!', 'success');
        onOrderComplete();
      }
    } catch (error) {
      console.error('Order processing error:', error);
      setError(error instanceof Error ? error.message : 'Failed to process order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRazorpay = async () => {
    setIsPaying(true);
    await loadRazorpayScript();
    const options = {
      key: 'rzp_live_5SW7TjdeeGzqoU',
      amount: finalTotal * 100, // in paise
      currency: 'INR',
      name: 'Nellai Super Market',
      description: 'Order Payment',
      handler: function (response: any) {
        setIsPaying(false);
        if (showToast) showToast('Payment successful!', 'success');
        handleSubmit(); // Place order after payment
      },
      prefill: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        contact: formData.phone,
      },
      theme: {
        color: '#16a34a',
      },
      modal: {
        ondismiss: () => {
          setIsPaying(false);
          if (showToast) showToast('Payment cancelled', 'info');
        },
      },
    };
    // @ts-ignore
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const isFormValid = () => {
    return Object.values(formData).every(value => value.toString().trim() !== '');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-green-600 hover:text-green-700 mb-6 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Cart</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Checkout Details</h2>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <h4 className="text-red-800 font-medium">Order Processing Error</h4>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Delivery Address</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
              <div className="space-y-3">
                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  <CreditCard className="h-5 w-5 mr-2 text-gray-600" />
                  <span>Credit/Debit Card</span>
                </label>
                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={formData.paymentMethod === 'upi'}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  <Smartphone className="h-5 w-5 mr-2 text-gray-600" />
                  <span>UPI Payment</span>
                </label>
                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  <Truck className="h-5 w-5 mr-2 text-gray-600" />
                  <span>Cash on Delivery</span>
                </label>
              </div>
            </div>

            <button
              type="button"
              disabled={!isFormValid() || isProcessing || isPaying}
              onClick={handleRazorpay}
              className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-200 mb-4 ${
                isFormValid() && !isProcessing && !isPaying
                  ? 'bg-green-600 hover:bg-green-700 text-white transform hover:scale-[1.02]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isPaying ? 'Processing Payment...' : `Proceed to Pay - ₹${finalTotal}`}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
          
          <div className="space-y-3 mb-6">
            {cartItems.map(item => (
              <div key={item.id} className="flex items-center space-x-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                </div>
                <span className="font-medium">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">₹{getTotalPrice()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Fee</span>
              <span className="font-medium">
                {deliveryFee === 0 ? (
                  <span className="text-green-600">Free</span>
                ) : (
                  `₹${deliveryFee}`
                )}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t">
              <span>Total</span>
              <span className="text-green-600">₹{finalTotal}</span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <p className="text-green-700 text-sm text-center">
              🔒 Your payment information is secured with SSL encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}