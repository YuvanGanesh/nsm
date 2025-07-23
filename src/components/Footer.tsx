import React from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import { useCallback } from 'react';

export function Footer({ onNavigate }: { onNavigate?: (page: string) => void } = {}) {
  // Fallback for navigation if not provided
  const navigate = onNavigate || ((page: string) => { window.scrollTo(0, 0); window.location.hash = page; });
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <div>
                <h2 className="text-xl font-bold">Nellai Super Market</h2>
                <p className="text-gray-400 text-sm">Your Local Store Online</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Experience the convenience of shopping from your local supermarket online. 
              Fresh products, competitive prices, and doorstep delivery - all in one place.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button onClick={() => navigate('about')} className="text-gray-300 hover:text-white transition-colors w-full text-left">About Us</button>
              </li>
              <li>
                <button onClick={() => navigate('products')} className="text-gray-300 hover:text-white transition-colors w-full text-left">Our Products</button>
              </li>
              <li>
                <button onClick={() => navigate('delivery-info')} className="text-gray-300 hover:text-white transition-colors w-full text-left">Delivery Info</button>
              </li>
              <li>
                <button onClick={() => navigate('return-policy')} className="text-gray-300 hover:text-white transition-colors w-full text-left">Return Policy</button>
              </li>
              <li>
                <button onClick={() => navigate('privacy-policy')} className="text-gray-300 hover:text-white transition-colors w-full text-left">Privacy Policy</button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-green-400 mt-0.5" />
                <div>
                  <p className="text-gray-300">Old No.11, Kamarajapuram Main Rd</p>
                  <p className="text-gray-300">Kamarajapuram, Gowriwakkam</p>
                  <p className="text-gray-300">Sembakkam, Chennai, Tamil Nadu 600073</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-green-400" />
                <p className="text-gray-300">+91 90870 74333</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-green-400" />
                <p className="text-gray-300">info@nellaisupermarket.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 Nellai Super Market. All rights reserved. | 
            <span className="ml-2">Designed with ❤️ for our community</span>
          </p>
        </div>
      </div>
    </footer>
  );
}