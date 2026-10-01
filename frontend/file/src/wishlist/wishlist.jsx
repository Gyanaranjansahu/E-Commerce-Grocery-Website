import React, { useContext } from 'react';
import { Trash2, ShoppingBag, ArrowLeft, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import { GlobalContext } from '../context/Usecontext.jsx';
import Costume from '../services/costume.js';

export default function WishlistPage() {
  const { wishdata, removeFromWishlist, fetchCart } = useContext(GlobalContext);
  const { handleCart } = Costume();

  const items = Array.isArray(wishdata) ? wishdata : [];

  const handleAddToCart = async (product) => {
    const id = product?._id;
    if (!id) return;
    try {
      await handleCart(id);
      if (fetchCart) await fetchCart();
    } catch (err) {
      console.error("Failed to add from wishlist to cart:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FBFBFA] text-[#161B16] font-sans antialiased">
      <div>
        <Navbar />

        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-6 border-b border-stone-200">
            <div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#1B3821] uppercase block mb-1">
                Saved Favourites
              </span>
              <h1 className="text-2xl font-serif font-bold text-stone-900">My Wishlist</h1>
              <p className="text-xs text-stone-500 mt-1">
                {items.length} {items.length === 1 ? 'item' : 'items'} saved for later harvest
              </p>
            </div>
            <Link
              to="/shop"
              className="text-xs font-semibold uppercase tracking-wider text-[#1B3821] hover:underline flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
            </Link>
          </div>

          {/* List or Empty State */}
          {items.length === 0 ? (
            <div className="py-20 text-center bg-white border border-stone-200 rounded-lg p-8 mt-6">
              <Heart className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h2 className="text-base font-serif font-semibold text-stone-800">Your wishlist is empty</h2>
              <p className="text-xs text-stone-500 mt-1 mb-6">
                Explore our farm harvest and save your favorite staples here.
              </p>
              <Link
                to="/shop"
                className="inline-block px-6 py-2.5 bg-[#1B3821] text-white text-xs font-semibold uppercase tracking-wider rounded-md hover:bg-[#122817] transition shadow-xs"
              >
                Go to Shop
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-stone-200 bg-white border border-stone-200 rounded-lg mt-6 overflow-hidden">
              {items.map((item, index) => {
                const product = item?.productId?._id ? item.productId : item;
                const productId = product?._id || item?.productId || item?._id;

                if (!product || !product.name) return null;

                return (
                  <div
                    key={productId || index}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50/60 transition"
                  >
                    {/* Product Details */}
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-stone-100 border border-stone-200 rounded-md overflow-hidden shrink-0">
                        <img
                          src={product.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=80"}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-sm sm:text-base text-stone-900 line-clamp-1">
                            {product.name}
                          </h3>
                          {product.category && (
                            <span className="text-[9px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded border border-stone-200 font-medium">
                              {product.category}
                            </span>
                          )}
                        </div>
                        {product.description && (
                          <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">
                            {product.description}
                          </p>
                        )}
                        <span className="text-sm font-bold text-stone-900 block mt-1">₹{product.price}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        className="px-4 py-2 bg-[#1B3821] hover:bg-[#122817] text-white text-xs font-semibold rounded-md flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        Add to Basket
                      </button>

                      <button
                        type="button"
                        onClick={() => removeFromWishlist && removeFromWishlist(productId)}
                        className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 border border-stone-200 rounded-md transition cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}