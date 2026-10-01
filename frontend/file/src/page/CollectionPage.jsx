import React, { useState, useMemo, useContext } from 'react';
import { Heart, Plus, Minus, Search, Sparkles } from 'lucide-react';
import Navbar from '../components/Nav.jsx';
import { GlobalContext } from '../context/Usecontext.jsx';
import Costume from '../services/costume.js';

const CATEGORIES = [
  "All",
  "Fruits",
  "Vegetables",
  "Dairy",
  "Meat",
  "Beverages",
  "Snacks"
];

export default function CollectionPage() {
  const {
    product = [],
    productLoading,
    cart = [],
    setCart,
    total = 0,
    setTotal,
    wishdata = [],
    getWishlist,
    fetchCart,
  } = useContext(GlobalContext);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [likedItems, setLikedItems] = useState({});

  // Custom hook wrapping backend interactions
  const { handleCart, handleCartUpdate, handleDeleteItem, handleWish } = Costume();

  // Helper to extract a consistent ID string
  const getItemId = (item) => String(item?._id || item?.id || "");

  // Check if item is in wishlist
  const isItemLiked = (itemId) => {
    if (likedItems[itemId] !== undefined) return likedItems[itemId];
    return (wishdata || []).some((w) => {
      const id = w.productId?._id || w.productId || w._id;
      return String(id) === String(itemId);
    });
  };

  // ==========================================
  // 1. ADD NEW ITEM
  // ==========================================
  const onAddToCart = async (item) => {
    const itemId = getItemId(item);
    if (!itemId) return;

    const previousCart = [...cart];

    // Optimistic UI update
    setCart((prevCart = []) => [
      ...prevCart,
      { ...item, productId: itemId, quantity: 1 }
    ]);
    if (setTotal) setTotal((prev) => prev + 1);

    try {
      await handleCart(itemId);
      if (fetchCart) await fetchCart();
    } catch (err) {
      console.error("Backend add failed, rolling back:", err.message);
      setCart(previousCart);
      if (setTotal) setTotal(previousCart.length);
    }
  };

  // ==========================================
  // 2. INCREMENT QUANTITY (+1)
  // ==========================================
  const onIncrement = async (itemId, currentQty = 1) => {
    const newQty = currentQty + 1;
    const previousCart = [...cart];

    // Optimistic UI update
    setCart((prevCart = []) =>
      prevCart.map((cartItem) => {
        const id = getItemId(cartItem.productId) || getItemId(cartItem);
        return id === String(itemId) ? { ...cartItem, quantity: newQty } : cartItem;
      })
    );

    try {
      await handleCartUpdate(itemId, newQty);
    } catch (err) {
      console.error("Backend update failed, rolling back:", err.message);
      setCart(previousCart);
    }
  };

  // ==========================================
  // 3. DECREMENT QUANTITY (-1 or DELETE)
  // ==========================================
  const onDecrement = async (itemId, currentQty = 1) => {
    const previousCart = [...cart];

    // If quantity is 1, decrementing removes the item completely
    if (currentQty <= 1) {
      setCart((prevCart = []) =>
        prevCart.filter((cartItem) => {
          const id = getItemId(cartItem.productId) || getItemId(cartItem);
          return id !== String(itemId);
        })
      );
      if (setTotal) setTotal((prev) => Math.max(0, prev - 1));

      try {
        await handleDeleteItem(itemId);
      } catch (err) {
        console.error("Backend delete failed, rolling back:", err.message);
        setCart(previousCart);
        if (setTotal) setTotal(previousCart.length);
      }
      return;
    }

    const newQty = currentQty - 1;

    // Optimistic UI decrement
    setCart((prevCart = []) =>
      prevCart.map((cartItem) => {
        const id = getItemId(cartItem.productId) || getItemId(cartItem);
        return id === String(itemId) ? { ...cartItem, quantity: newQty } : cartItem;
      })
    );

    try {
      await handleCartUpdate(itemId, newQty);
    } catch (err) {
      console.error("Backend update failed, rolling back:", err.message);
      setCart(previousCart);
    }
  };

  // ==========================================
  // 4. TOGGLE WISHLIST
  // ==========================================
  const toggleLike = async (itemId) => {
    if (!itemId) return;

    // Optimistic toggle
    setLikedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));

    try {
      await handleWish(itemId);
      if (getWishlist) await getWishlist();
    } catch (err) {
      console.error("Wishlist toggle failed, rolling back:", err.message);
      // Rollback on network/server failure
      setLikedItems((prev) => ({
        ...prev,
        [itemId]: !prev[itemId]
      }));
    }
  };

  // Filter products by search query and category
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(product)) return [];

    return product.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      const matchesSearch =
        item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [product, selectedCategory, searchQuery]);

  return (
    <div className="w-full min-h-screen bg-[#FBFBFA] text-[#1E221E] font-sans antialiased py-6 px-3 sm:px-6 lg:px-8">
      {/* Top Header, Search, & Filters */}
      <section className="max-w-7xl mx-auto space-y-4 mb-6">
        <Navbar cartCount={total || cart.length} />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[9px] font-bold tracking-[0.2em] text-[#1B3821] uppercase block">
              100% Certified Direct Harvest
            </span>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#161B16]">
              Farm Collection & Staples
            </h1>
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search staples, milk, fruits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F4F3EE] text-xs py-2 pl-8 pr-3 rounded-full border border-stone-300 focus:border-[#1B3821] focus:bg-white outline-none transition"
            />
            <Search className="w-3.5 h-3.5 text-stone-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#1B3821] text-white shadow-xs"
                  : "bg-[#F4F3EE] text-[#4E564E] hover:bg-[#EBE9E1] border border-stone-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Status Counter */}
        <div className="flex items-center justify-between pt-1 border-t border-stone-200 text-[11px] text-stone-600">
          <span>
            Showing <strong className="text-stone-900">{filteredProducts.length}</strong> fresh essentials
          </span>
          <div className="inline-flex items-center gap-1 text-[10px] text-[#1B3821] font-medium bg-[#F2F5ED] px-2 py-0.5 rounded border border-[#DFE5D7]">
            <Sparkles className="w-3 h-3" />
            Zero Carbide • Farm Direct
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="max-w-7xl mx-auto">
        {productLoading ? (
          <div className="text-center py-20 text-xs text-stone-500">
            Loading products from database...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white border border-stone-200 p-6">
            <p className="text-sm font-serif font-medium text-stone-800">No groceries found.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="mt-3 px-3 py-1.5 bg-[#1B3821] text-white text-[10px] uppercase tracking-wider cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {filteredProducts.map((item) => {
              const itemId = getItemId(item);

              // Check if item is already present in cart
              const cartItem = cart.find((c) => {
                const cId = getItemId(c.productId) || getItemId(c);
                return cId === itemId;
              });

              return (
                <div
                  key={itemId}
                  className="bg-white border border-[#EAE8E1] hover:border-[#1B3821] rounded-xs flex flex-col justify-between transition duration-200 hover:shadow-xs group"
                >
                  <div>
                    {/* Media Container */}
                    <div className="relative aspect-square w-full bg-[#F4F3EE] overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        loading="lazy"
                      />

                      <span className="absolute top-1.5 left-1.5 bg-white/95 text-[#1B3821] text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 border border-[#E4E1D7]">
                        {item.category}
                      </span>

                      <button
                        type="button"
                        onClick={() => toggleLike(itemId)}
                        aria-label="Wishlist"
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-white/95 flex items-center justify-center text-stone-500 hover:text-red-700 border border-stone-200 transition cursor-pointer"
                      >
                        <Heart
                          className={`w-3 h-3 transition ${
                            isItemLiked(itemId) ? "fill-red-700 text-red-700" : ""
                          }`}
                        />
                      </button>
                    </div>

                    {/* Details */}
                    <div className="p-2.5 space-y-1">
                      <h3 className="font-serif font-semibold text-xs text-stone-900 leading-snug line-clamp-1">
                        {item.name}
                      </h3>

                      <p className="text-[10px] text-stone-500 line-clamp-1 leading-normal">
                        {item.description}
                      </p>

                      <span className="inline-block text-[9px] font-medium text-stone-600 bg-[#F7F6F2] px-1.5 py-0.5 border border-stone-200 rounded-xs">
                        Stock: {item.quantity}
                      </span>
                    </div>
                  </div>

                  {/* Pricing & Cart Action */}
                  <div className="p-2.5 pt-0">
                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-stone-900">
                        ₹{item.price}
                      </span>

                      {cartItem ? (
                        <div className="flex items-center border border-stone-200 rounded-xs bg-[#FBFBFA]">
                          <button
                            type="button"
                            onClick={() => onDecrement(itemId, cartItem.quantity || 1)}
                            className="p-1 hover:bg-stone-200 text-stone-600 cursor-pointer transition"
                            aria-label="Reduce count"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="w-5 text-center text-[10px] font-bold text-stone-900">
                            {cartItem.quantity || 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => onIncrement(itemId, cartItem.quantity || 1)}
                            className="p-1 hover:bg-stone-200 text-stone-600 cursor-pointer transition"
                            aria-label="Increase count"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onAddToCart(item)}
                          className="px-2.5 py-1 bg-[#1B3821] hover:bg-[#122817] text-white text-[10px] font-semibold tracking-wider uppercase flex items-center gap-1 transition cursor-pointer rounded-2xs"
                        >
                          <Plus className="w-2.5 h-2.5" />
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
      </section>
    </div>
  );
}