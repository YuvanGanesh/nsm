import { supabase } from '../lib/supabase';
import { OrderService } from './orderService';

export class AuthService {
  /**
   * Sign up a new user
   */
  static async signUp(email: string, password: string, name: string, phone?: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone
          }
        }
      });

      if (error) {
        throw new Error(`Sign up failed: ${error.message}`);
      }

      // Create customer record
      if (data.user) {
        await OrderService.createOrGetCustomer(email, name, phone);
      }

      return data;
    } catch (error) {
      console.error('Error in signUp:', error);
      throw error;
    }
  }

  /**
   * Sign in user
   */
  static async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw new Error(`Sign in failed: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error in signIn:', error);
      throw error;
    }
  }

  /**
   * Sign out user
   */
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw new Error(`Sign out failed: ${error.message}`);
      }
    } catch (error) {
      console.error('Error in signOut:', error);
      throw error;
    }
  }

  /**
   * Get current user
   */
  static async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        throw new Error(`Failed to get user: ${error.message}`);
      }

      return user;
    } catch (error) {
      console.error('Error in getCurrentUser:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(updates: { name?: string; phone?: string }) {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: updates
      });

      if (error) {
        throw new Error(`Profile update failed: ${error.message}`);
      }

      // Update customer record
      if (data.user) {
        const { data: customer, error: customerError } = await supabase
          .from('customers')
          .update(updates)
          .eq('email', data.user.email)
          .select()
          .single();

        if (customerError) {
          console.warn('Failed to update customer record:', customerError.message);
        }
      }

      return data;
    } catch (error) {
      console.error('Error in updateProfile:', error);
      throw error;
    }
  }

  /**
   * Reset password
   */
  static async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) {
        throw new Error(`Password reset failed: ${error.message}`);
      }
    } catch (error) {
      console.error('Error in resetPassword:', error);
      throw error;
    }
  }
}