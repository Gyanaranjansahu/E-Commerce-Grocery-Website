import React, { useState, useMemo } from 'react';
import { Heart, Plus, Minus, Search, Sparkles, ShoppingBag } from 'lucide-react';
import Navbar from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import { useApp } from '../context/Usecontext.jsx';
import Costume from '../services/costume.js';
import { toast } from 'sonner';
                    
const CATEGORIES = [
  "All",
  "Dairy",
  "Vegetables",
  "Fruits",
  "Meat",
  "Beverages",
  "Snacks",
];

// Curated farm staples fallback if database is loading or catalog is being populated
const STAPLE_FALLBACKS = [
  {
    _id: 'prod-fallback-1',
    name: 'A2 Vedic Gir Cow Raw Milk',
    description: 'Chilled unpasteurized A2 milk in sterilized glass bottles. Delivered within 4 hours of morning milking.',
    price: 95,
    quantity: '50 units',
    category: 'Dairy',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
  },
  {
    _id: 'prod-fallback-2',
    name: 'Hand-Churned Bilona Desi Ghee',
    description: 'Traditional 5-samskara Vedic method from whole A2 curd. Golden, aromatic, and granular texture.',
    price: 890,
    quantity: '30 units',
    category: 'Dairy',
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80',
  },
  {
    _id: 'prod-fallback-3',
    name: 'Stone-Ground Sharbati Wheat Atta',
    description: 'Slow-milled on traditional stone chakki at cold temperatures. Retains 100% natural wheat germ and dietary bran.',
    price: 320,
    quantity: '40 units',
    category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
  },
  {
    _id: 'prod-fallback-4',
    name: 'Chemical-Free Palak & Mustard Greens',
    description: 'Harvested at 4:00 AM from chemical-free biodynamic soil. Rich in iron, crisp texture, zero synthetic spray.',
    price: 45,
    quantity: '60 units',
    category: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80',
  },
  {
    _id: 'prod-fallback-5',
    name: 'Wood Cold-Pressed Yellow Mustard Oil',
    description: 'Extracted below 35°C in wooden churners. Retains natural pungent allyl isothiocyanate and antioxidants.',
    price: 240,
    quantity: '25 units',
    category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
  },
  {
    _id: 'prod-fallback-6',
    name: 'High-Altitude Kinnaur Red Royal Apples',
    description: 'Plucked from high-altitude Himachal family orchards. Crisp, sweet, juicy, and naturally unwaxed.',
    price: 180,
    quantity: '35 units',
    category: 'Fruits',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
  },
];

export default function CollectionPage() {
  const { 
    product = [], 
    productLoading, 
    cart = [], 
    addToCart, 
    updateCartQuantity, 
    removeFromCart, 
    getItemId,
    wishdata = [],
    removeFromWishlist,
  } = useApp();
  
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { handleWish } = Costume();

  // Combine database products with staple fallbacks if database has 0 products
  const displayProducts = useMemo(() => {
    if (Array.isArray(product) && product.length > 0) {
      return product;
    }
    return STAPLE_FALLBACKS;
  }, [product]);

  // Filter products by search and category
  const filteredProducts = useMemo(() => {
    return displayProducts.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" ||
        item.category?.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [displayProducts, selectedCategory, searchQuery]);

  // Wishlist set for fast O(1) lookup
  const wishlistIds = useMemo(() => {
    const set = new Set();
    if (Array.isArray(wishdata)) {
      wishdata.forEach((w) => {
        const id = w?.productId?._id || w?.productId || w?._id;
        if (id) set.add(String(id));
      });
    }
    return set;
  }, [wishdata]);

  // 1. ADD NEW ITEM TO BASKET
  const onAddToCart = async (item) => {
    try {
      await addToCart(item, 1);
      toast.success(`${item.name} added to basket`);
    } catch (err) {
      toast.error(err.message || "Failed to add product");
    }
  };

  // 2. INCREMENT QUANTITY (+1)
  const onIncrement = async (itemId, currentQty = 1) => {
    try {
      await updateCartQuantity(itemId, currentQty + 1);
    } catch (err) {
      toast.error("Failed to update quantity");
    }
  };

  // 3. DECREMENT QUANTITY (-1 or REMOVE)
  const onDecrement = async (itemId, currentQty = 1) => {
    try {
      if (currentQty <= 1) {
        await removeFromCart(itemId);
      } else {
        await updateCartQuantity(itemId, currentQty - 1);
      }
    } catch (err) {
      toast.error("Failed to update quantity");
    }
  };

  // Toggle wishlist
  const toggleLike = async (itemId) => {
    try {
      if (removeFromWishlist && wishlistIds.has(String(itemId))) {
        await removeFromWishlist(itemId);
        toast.info("Removed from saved favourites");
      } else {
        await handleWish(itemId);
        toast.success("Saved to your favourites");
      }
    } catch (err) {
      toast.error("Failed to update wishlist");
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FBFBFA] text-[#1E221E] font-sans antialiased flex flex-col justify-between">
      <div>
        <Navbar />

        {/* Top Header, Search, & Filters */}
        <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#1B3821] uppercase block mb-1">
                Khet Se Kitchen Tak • 100% Certified
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#161B16]">
                Farm Collection & Staples
              </h1>
              <p className="text-xs text-stone-500 mt-0.5">
                Plucked at dawn from certified biodynamic farms. Zero chemical residue.
              </p>
            </div>

            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Search raw milk, atta, cold-pressed oils..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-xs py-2.5 pl-9 pr-4 rounded-full border border-stone-300 focus:border-[#1B3821] focus:ring-1 focus:ring-[#1B3821] outline-none transition shadow-2xs"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? "bg-[#1B3821] text-white shadow-xs"
                    : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Count & Purity Status */}
          <div className="flex items-center justify-between pt-2 border-t border-stone-200 text-xs text-stone-600">
            <span>
              Showing <strong className="text-stone-900">{filteredProducts.length}</strong> farm essentials
            </span>
            <div className="inline-flex items-center gap-1.5 text-[11px] text-[#1B3821] font-semibold bg-[#EDF3EC] px-2.5 py-0.5 rounded-full border border-[#D5E2D4]">
              <Sparkles className="w-3.5 h-3.5 text-[#1B3821]" />
              Zero Carbide • Glass Bottled Milk
            </div>
          </div>
        </header>

        {/* Product Grid */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {productLoading ? (
            <div className="text-center py-24 text-xs text-stone-500">
              <div className="w-8 h-8 border-2 border-stone-300 border-t-[#1B3821] rounded-full animate-spin mx-auto mb-3" />
              Gathering fresh harvest from partner farms...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white border border-stone-200 rounded-xl p-8 max-w-md mx-auto">
              <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h2 className="text-base font-serif font-semibold text-stone-800">No groceries match your search</h2>
              <p className="text-xs text-stone-500 mt-1 mb-6">
                Try searching for different keywords or resetting the category filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="px-5 py-2 bg-[#1B3821] text-white text-xs font-semibold uppercase tracking-wider rounded-md hover:bg-[#122817] transition cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {filteredProducts.map((item) => {
                const itemId = item._id || item.id;
                
                // Check if item is already in basket
                const cartItem = cart.find((c) => {
                  const cId = c.productId?._id || c.productId || c._id;
                  return String(cId) === String(itemId);
                });

                const isLiked = wishlistIds.has(String(itemId));

                return (
                  <div
                    key={itemId}
                    className="bg-white border border-[#EAE8E1] hover:border-[#1B3821] rounded-lg flex flex-col justify-between transition duration-200 hover:shadow-sm group overflow-hidden"
                  >
                    {/* Media Header */}
                    <div>
                      <div className="relative aspect-square w-full bg-[#F4F3EE] overflow-hidden">
                        <img
                          src={item.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80"}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-104 transition duration-300"
                          loading="lazy"
                        />

                        {item.category && (
                          <span className="absolute top-2 left-2 bg-white/95 backdrop-blur-xs text-[#1B3821] text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs border border-stone-200 shadow-2xs">
                            {item.category}
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => toggleLike(itemId)}
                          aria-label="Save to wishlist"
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/95 backdrop-blur-xs flex items-center justify-center text-stone-400 hover:text-rose-600 border border-stone-200 transition cursor-pointer shadow-2xs"
                        >
                          <Heart
                            className={`w-3.5 h-3.5 transition ${
                              isLiked ? "fill-rose-600 text-rose-600" : ""
                            }`}
                          />
                        </button>
                      </div>

                      {/* Info Details */}
                      <div className="p-3 space-y-1">
                        <h3 className="font-serif font-bold text-xs sm:text-sm text-stone-900 leading-snug line-clamp-1">
                          {item.name}
                        </h3>

                        <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>

                        <div className="pt-1">
                          <span className="inline-block text-[9px] font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                            {item.quantity ? `Stock: ${item.quantity}` : 'Farm Harvest'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Price & Cart Actions */}
                    <div className="p-3 pt-0">
                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-1">
                        <span className="text-sm font-bold text-stone-900">
                          ₹{item.price}
                        </span>

                        {cartItem ? (
                          <div className="flex items-center border border-stone-300 rounded-md bg-[#FBFBFA]">
                            <button
                              type="button"
                              onClick={() => onDecrement(itemId, cartItem.quantity || 1)}
                              className="px-2 py-1 hover:bg-stone-200 text-stone-600 cursor-pointer transition"
                              aria-label="Reduce quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-bold text-stone-900">
                              {cartItem.quantity || 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => onIncrement(itemId, cartItem.quantity || 1)}
                              className="px-2 py-1 hover:bg-stone-200 text-stone-600 cursor-pointer transition"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onAddToCart(item)}
                            className="px-3 py-1.5 bg-[#1B3821] hover:bg-[#122817] text-white text-[11px] font-semibold tracking-wider uppercase flex items-center gap-1 transition cursor-pointer rounded-md shadow-2xs"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add</span>
                          </button>
                        )}
                      </div>
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
