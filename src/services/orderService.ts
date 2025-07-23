import { supabase } from '../lib/supabase';
import { CartItem, CheckoutForm } from '../types';
import { Customer, Order, OrderItem, Payment } from '../lib/supabase';

export class OrderService {
  /**
   * Create a new customer or get existing one
   */
  static async createOrGetCustomer(email: string, name: string, phone?: string): Promise<Customer> {
    try {
      // Check if customer exists
      const { data: existingCustomer, error: fetchError } = await supabase
        .from('customers')
        .select('*')
        .eq('email', email)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw new Error(`Failed to fetch customer: ${fetchError.message}`);
      }

      if (existingCustomer) {
        // Update customer info if needed
        const { data: updatedCustomer, error: updateError } = await supabase
          .from('customers')
          .update({ name, phone })
          .eq('id', existingCustomer.id)
          .select()
          .single();

        if (updateError) {
          throw new Error(`Failed to update customer: ${updateError.message}`);
        }

        return updatedCustomer;
      }

      // Create new customer
      const { data: newCustomer, error: createError } = await supabase
        .from('customers')
        .insert({ email, name, phone })
        .select()
        .single();

      if (createError) {
        throw new Error(`Failed to create customer: ${createError.message}`);
      }

      return newCustomer;
    } catch (error) {
      console.error('Error in createOrGetCustomer:', error);
      throw error;
    }
  }

  /**
   * Generate unique order number
   */
  static generateOrderNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `NSM${timestamp.slice(-6)}${random}`;
  }

  /**
   * Create a new order with items and payment
   */
  static async createOrder(
    customerId: string,
    cartItems: CartItem[],
    checkoutForm: CheckoutForm,
    totalAmount: number,
    deliveryFee: number
  ): Promise<{ order: Order; payment: Payment }> {
    try {
      const orderNumber = this.generateOrderNumber();

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_id: customerId,
          order_number: orderNumber,
          status: 'pending',
          total_amount: totalAmount + deliveryFee,
          delivery_fee: deliveryFee,
          delivery_address: {
            firstName: checkoutForm.firstName,
            lastName: checkoutForm.lastName,
            address: checkoutForm.address,
            city: checkoutForm.city,
            zipCode: checkoutForm.zipCode,
            phone: checkoutForm.phone
          },
          payment_method: checkoutForm.paymentMethod
        })
        .select()
        .single();

      if (orderError) {
        throw new Error(`Failed to create order: ${orderError.message}`);
      }

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        product_price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        throw new Error(`Failed to create order items: ${itemsError.message}`);
      }

      // Create payment record
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert({
          order_id: order.id,
          payment_method: checkoutForm.paymentMethod,
          payment_status: checkoutForm.paymentMethod === 'cod' ? 'pending' : 'processing',
          amount: totalAmount + deliveryFee,
          transaction_id: checkoutForm.paymentMethod === 'cod' ? null : `TXN${Date.now()}`
        })
        .select()
        .single();

      if (paymentError) {
        throw new Error(`Failed to create payment: ${paymentError.message}`);
      }

      // Update order status based on payment method
      if (checkoutForm.paymentMethod === 'cod') {
        await this.updateOrderStatus(order.id, 'confirmed');
      }

      return { order, payment };
    } catch (error) {
      console.error('Error in createOrder:', error);
      throw error;
    }
  }

  /**
   * Update order status
   */
  static async updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
    try {
      const { data: order, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update order status: ${error.message}`);
      }

      return order;
    } catch (error) {
      console.error('Error in updateOrderStatus:', error);
      throw error;
    }
  }

  /**
   * Get customer orders with items
   */
  static async getCustomerOrders(customerId: string): Promise<(Order & { items: OrderItem[]; payment: Payment })[]> {
    try {
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(*),
          payments(*)
        `)
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });

      if (ordersError) {
        throw new Error(`Failed to fetch orders: ${ordersError.message}`);
      }

      return orders.map(order => ({
        ...order,
        items: order.order_items || [],
        payment: order.payments?.[0] || null
      }));
    } catch (error) {
      console.error('Error in getCustomerOrders:', error);
      throw error;
    }
  }

  /**
   * Get order by ID with full details
   */
  static async getOrderById(orderId: string): Promise<(Order & { items: OrderItem[]; payment: Payment; customer: Customer }) | null> {
    try {
      const { data: order, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(*),
          payments(*),
          customers(*)
        `)
        .eq('id', orderId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw new Error(`Failed to fetch order: ${error.message}`);
      }

      return {
        ...order,
        items: order.order_items || [],
        payment: order.payments?.[0] || null,
        customer: order.customers
      };
    } catch (error) {
      console.error('Error in getOrderById:', error);
      throw error;
    }
  }

  /**
   * Update payment status
   */
  static async updatePaymentStatus(
    paymentId: string, 
    status: Payment['payment_status'],
    transactionId?: string,
    gatewayResponse?: Record<string, any>
  ): Promise<Payment> {
    try {
      const updateData: Partial<Payment> = { payment_status: status };
      
      if (transactionId) {
        updateData.transaction_id = transactionId;
      }
      
      if (gatewayResponse) {
        updateData.payment_gateway_response = gatewayResponse;
      }

      const { data: payment, error } = await supabase
        .from('payments')
        .update(updateData)
        .eq('id', paymentId)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update payment status: ${error.message}`);
      }

      // Update order status based on payment status
      if (status === 'completed') {
        const { data: order } = await supabase
          .from('orders')
          .select('id')
          .eq('id', payment.order_id)
          .single();

        if (order) {
          await this.updateOrderStatus(order.id, 'confirmed');
        }
      }

      return payment;
    } catch (error) {
      console.error('Error in updatePaymentStatus:', error);
      throw error;
    }
  }

  /**
   * Cancel order
   */
  static async cancelOrder(orderId: string, reason?: string): Promise<Order> {
    try {
      // Update order status
      const order = await this.updateOrderStatus(orderId, 'cancelled');

      // Update payment status if not COD
      const { data: payment } = await supabase
        .from('payments')
        .select('*')
        .eq('order_id', orderId)
        .single();

      if (payment && payment.payment_method !== 'cod' && payment.payment_status === 'completed') {
        await this.updatePaymentStatus(payment.id, 'refunded', undefined, { reason });
      }

      return order;
    } catch (error) {
      console.error('Error in cancelOrder:', error);
      throw error;
    }
  }

  /**
   * Get order analytics
   */
  static async getOrderAnalytics(customerId?: string) {
    try {
      let query = supabase
        .from('orders')
        .select('status, total_amount, created_at');

      if (customerId) {
        query = query.eq('customer_id', customerId);
      }

      const { data: orders, error } = await query;

      if (error) {
        throw new Error(`Failed to fetch order analytics: ${error.message}`);
      }

      const analytics = {
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum, order) => sum + order.total_amount, 0),
        ordersByStatus: orders.reduce((acc, order) => {
          acc[order.status] = (acc[order.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        recentOrders: orders.slice(0, 5)
      };

      return analytics;
    } catch (error) {
      console.error('Error in getOrderAnalytics:', error);
      throw error;
    }
  }
}