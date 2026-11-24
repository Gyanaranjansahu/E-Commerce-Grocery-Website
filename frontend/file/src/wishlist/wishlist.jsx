import React, { useState, useEffect } from 'react';
import { Trash2, ShoppingBag, ArrowLeft, Heart } from 'lucide-react';
import Navbar from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
// import Costume from '../services/costume.js';

export default function WishlistPage() {


  const [items, setItems] = useState([
    {
      _id: '1',
      name: 'A2 Gir Cow Farm Fresh Raw Milk',
      unit: '1 Litre Glass Bottle',
      price: 110,
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=300&q=80',
    },
    {
      _id: '6',
      name: 'Organic Desi Danedar Bilona Ghee',
      unit: '500ml Glass Jar',
      price: 890,
      image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=300&q=80',
    },
    {
      _id: '4',
      name: 'Hydroponic Tender Baby Spinach & Methi',
      unit: '250g Fresh Bundle',
      price: 65,
      image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=300&q=80',
    }
  ]);

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item._id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white text-[#161B16]">
      <div>
        <Navbar />

        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-6 border-b border-gray-200">
            <div>
              <h1 className="text-2xl font-bold">My Wishlist</h1>
              <p className="text-sm text-gray-500 mt-1">
                {items.length} {items.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>
            <a
              href="/shop"
              className="text-xs font-semibold uppercase tracking-wider text-[#1B3821] hover:underline flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
            </a>
          </div>

          {/* List or Empty State */}
          {items.length === 0 ? (
            <div className="py-20 text-center">
              <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h2 className="text-lg font-semibold text-gray-800">Your wishlist is empty</h2>
              <p className="text-sm text-gray-500 mt-1 mb-6">
                Explore our store and add your favorite items here.
              </p>
              <a
                href="/shop"
                className="inline-block px-6 py-2.5 bg-[#1B3821] text-white text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-[#122817]"
              >
                Go to Shop
              </a>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  {/* Product Details (Image links to Shop) */}
                  <div className="flex items-center gap-4">
                    <a
                      href={`/shop?product=${item._id}`}
                      className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 border border-gray-200 rounded-sm overflow-hidden shrink-0"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </a>

                    <div>
                      <a
                        href={`/shop?product=${item._id}`}
                        className="font-medium text-sm sm:text-base hover:text-[#1B3821] transition line-clamp-1"
                      >
                        {item.name}
                      </a>
                      <span className="text-xs text-gray-500 block mt-0.5">{item.unit}</span>
                      <span className="text-sm font-bold text-gray-900 block mt-1">₹{item.price}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      className="px-4 py-2 bg-[#1B3821] hover:bg-[#122817] text-white text-xs font-semibold rounded-sm flex items-center gap-1.5 transition"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      Add to Cart
                    </button>

                    <button
                      type="button"
                      onClick={() => removeItem(item._id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-gray-50 border border-gray-200 rounded-sm transition"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}