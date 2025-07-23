import React, { useState, useEffect } from 'react';
import { ArrowLeft, Package, Clock, CheckCircle, XCircle, Truck, CreditCard, Smartphone, MapPin, Phone, Mail } from 'lucide-react';
import { OrderService } from '../services/orderService';
import { Order, OrderItem, Payment, Customer } from '../lib/supabase';

interface OrderDetailProps {
  orderId: string;
  onBack: () => void;
}

type OrderWithFullDetails = Order & { items: OrderItem[]; payment: Payment; customer: Customer };

export function OrderDetail({ orderId, onBack }: OrderDetailProps) {
  const [order, setOrder] = useState<OrderWithFullDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const orderDetails = await OrderService.getOrderById(orderId);
        setOrder(orderDetails);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-6 w-6 text-yellow-500" />;
      case 'confirmed':
      case 'preparing':
        return <Package className="h-6 w-6 text-blue-500" />;
      case 'shipped':
        return <Truck className="h-6 w-6 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-6 w-6 text-red-500" />;
      default:
        return <Clock className="h-6 w-6 text-gray-500" />;
    }
  };

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'card':
        return <CreditCard className="h-5 w-5" />;
      case 'upi':
        return <Smartphone className="h-5 w-5" />;
      case 'cod':
        return <Truck className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-green-600 hover:text-green-700 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Orders</span>
        </button>

        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-green-600 hover:text-green-700 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Orders</span>
        </button>

        <div className="text-center py-12">
          <XCircle className="h-16 w-16 text-red-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600">{error || 'The requested order could not be found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-green-600 hover:text-green-700 mb-6 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Orders</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Header */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getStatusIcon(order.status)}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Order #{order.order_number}
                  </h1>
                  <p className="text-gray-600">
                    Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                'bg-green-100 text-green-800'
              }`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.product_name}</h3>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-blue-600 font-medium">₹{item.product_price} each</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">₹{item.subtotal}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Delivery Address</h2>
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-gray-400 mt-1" />
              <div>
                <p className="font-medium text-gray-900">
                  {order.delivery_address.firstName} {order.delivery_address.lastName}
                </p>
                <p className="text-gray-600">{order.delivery_address.address}</p>
                <p className="text-gray-600">
                  {order.delivery_address.city}, {order.delivery_address.zipCode}
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{order.delivery_address.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary & Payment */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{order.total_amount - order.delivery_fee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-medium">
                  {order.delivery_fee === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    `₹${order.delivery_fee}`
                  )}
                </span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">₹{order.total_amount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Information</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                {getPaymentIcon(order.payment_method)}
                <div>
                  <p className="font-medium text-gray-900 capitalize">
                    {order.payment_method === 'cod' ? 'Cash on Delivery' : 
                     order.payment_method === 'upi' ? 'UPI Payment' : 'Card Payment'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Status: <span className={`font-medium ${
                      order.payment?.payment_status === 'completed' ? 'text-green-600' :
                      order.payment?.payment_status === 'failed' ? 'text-red-600' :
                      'text-yellow-600'
                    }`}>
                      {order.payment?.payment_status?.charAt(0).toUpperCase() + order.payment?.payment_status?.slice(1)}
                    </span>
                  </p>
                </div>
              </div>
              
              {order.payment?.transaction_id && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Transaction ID: <span className="font-mono">{order.payment.transaction_id}</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Customer Information</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">{order.customer.email}</span>
              </div>
              {order.customer.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">{order.customer.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}