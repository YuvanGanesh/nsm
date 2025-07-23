import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ivnkknjpudjziigtefey.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2bmtrbmpwdWRqemlpZ3RlZmV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxNjU4MTcsImV4cCI6MjA2ODc0MTgxN30.1arJJZIFFNg2fXN2wWQZfmgvw2Wu2nZ42yWZLETKBus';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Customer {
  id: string;
  email: string;
  name: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  customer_id: string;
  order_number: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  delivery_fee: number;
  delivery_address: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    zipCode: string;
    phone: string;
  };
  payment_method: 'card' | 'upi' | 'cod';
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: number;
  product_name: string;
  product_price: number;
  quantity: number;
  subtotal: number;
  created_at: string;
}

export interface Payment {
  id: string;
  order_id: string;
  payment_method: 'card' | 'upi' | 'cod';
  payment_status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  amount: number;
  transaction_id?: string;
  payment_gateway_response: Record<string, any>;
  created_at: string;
  updated_at: string;
}