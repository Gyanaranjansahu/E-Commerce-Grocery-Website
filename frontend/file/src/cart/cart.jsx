import React from "react";
import { Trash2, Plus, Minus, ArrowLeft, ShieldCheck, ShoppingBag } from "lucide-react";
import Navbar from "../components/Nav.jsx";
import { useApp } from "../context/Usecontext.jsx";
import { Link } from "react-router-dom";

export default function CartPage() {
  const { cart, updateCartQuantity, removeFromCart, total: cartCount } = useApp();

  // Normalize cart items: array format or populated mongoose document
  const cartItems = Array.isArray(cart)
    ? cart
    : Array.isArray(cart?.products)
      ? cart.products
      : [];

  // ========================================================
  // 1. UPDATE QUANTITY (+1 / -1) VIA CENTRAL CONTEXT
  // ========================================================
  const handleQuantity = async (productId, delta) => {
    const currentItem = cartItems.find((item) => {
      const id = item.productId?._id || item.productId || item._id;
      return String(id) === String(productId);
    });

    if (!currentItem) return;

    const nextQty = (currentItem.quantity || 1) + delta;
    try {
      await updateCartQuantity(productId, nextQty);
    } catch (error) {
      console.error("Failed to update cart quantity:", error.message);
    }
  };

  // ========================================================
  // 2. REMOVE ITEM FROM CART VIA CENTRAL CONTEXT
  // ========================================================
  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
    } catch (error) {
      console.error("Failed to remove item from cart:", error.message);
    }
  };

  // Dynamic calculations
  const subtotal = cartItems.reduce((acc, item) => {
    const price = typeof item.productId === "object" ? item.productId?.price || 0 : item.price || 0;
    return acc + price * (item.quantity || 1);
  }, 0);

  const delivery = subtotal > 500 || subtotal === 0 ? 0 : 40;
  const totalAmount = subtotal + delivery;

  return (
    <div className="w-full min-h-screen bg-[#FBFBFA] text-[#1E221E] font-sans antialiased py-6 px-3 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <Navbar cartCount={cartCount || cartItems.length} />

        {/* Header Breadcrumb & Title */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <div>
            <span className="text-[9px] font-bold tracking-[0.2em] text-[#1B3821] uppercase block">
              Direct Farm Harvest
            </span>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#161B16]">
              Your Basket ({cartItems.length})
            </h1>
          </div>
          <Link
            to="/"
            className="text-xs font-semibold text-[#1B3821] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
          </Link>
        </div>

        {/* Empty State vs Products Grid */}
        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-white border border-[#EAE8E1] p-8 rounded-xs space-y-3">
            <ShoppingBag className="w-10 h-10 text-stone-400 mx-auto stroke-[1.25]" />
            <h2 className="text-sm font-serif font-semibold text-stone-800">Your basket is empty</h2>
            <p className="text-xs text-stone-500">Explore our farm harvest and add fresh staples to your cart.</p>
            <Link
              to="/"
              className="inline-block mt-2 px-4 py-2 bg-[#1B3821] text-white text-[10px] font-semibold uppercase tracking-wider rounded-2xs hover:bg-[#122817] transition"
            >
              Browse Harvest
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

            {/* Cart Products List */}
            <div className="lg:col-span-2 space-y-3">
              {cartItems.map((cartItem) => {
                const product = typeof cartItem.productId === "object" ? cartItem.productId : cartItem;
                const itemId = product?._id || cartItem.productId;

                if (!product) return null;

                return (
                  <div
                    key={itemId}
                    className="bg-white border border-[#EAE8E1] hover:border-stone-300 p-3 sm:p-4 rounded-xs flex gap-3 sm:gap-4 items-center justify-between transition shadow-xs"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-[#F4F3EE] rounded-xs overflow-hidden shrink-0 border border-stone-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      {product.category && (
                        <span className="absolute top-1 left-1 bg-white/95 text-[#1B3821] text-[7px] font-bold uppercase tracking-wider px-1 py-0.5 border border-[#E4E1D7]">
                          {product.category}
                        </span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 pr-2">
                      <h2 className="text-xs sm:text-sm font-serif font-semibold text-stone-900 truncate">
                        {product.name}
                      </h2>
                      <p className="text-[10px] text-stone-500 line-clamp-1 mt-0.5">
                        {product.description}
                      </p>
                      <p className="text-xs sm:text-sm font-bold text-stone-900 mt-2">
                        ₹{product.price}
                      </p>
                    </div>

                    {/* Quantity Controls & Delete */}
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                      <div className="flex items-center border border-stone-200 rounded-xs bg-[#FBFBFA]">
                        <button
                          type="button"
                          onClick={() => handleQuantity(itemId, -1)}
                          className="p-1 sm:p-1.5 hover:bg-stone-200 text-stone-600 transition cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 sm:w-8 text-center text-xs font-semibold text-stone-800">
                          {cartItem.quantity || 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQuantity(itemId, 1)}
                          className="p-1 sm:p-1.5 hover:bg-stone-200 text-stone-600 transition cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemove(itemId)}
                        className="p-1.5 text-stone-400 hover:text-red-700 transition cursor-pointer"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Checkout / Order Summary Card */}
            <div className="bg-white border border-[#EAE8E1] p-4 sm:p-5 rounded-xs space-y-4 shadow-xs">
              <h2 className="text-xs font-serif font-bold text-stone-900 uppercase tracking-wider border-b border-stone-100 pb-2.5">
                Order Summary
              </h2>

              <div className="space-y-2.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Delivery Charges</span>
                  <span>
                    {delivery === 0 ? (
                      <span className="text-emerald-700 font-semibold text-[11px] uppercase tracking-wider">
                        Free
                      </span>
                    ) : (
                      `₹${delivery}`
                    )}
                  </span>
                </div>
                <div className="border-t border-stone-100 pt-3 flex justify-between text-sm font-bold text-stone-900">
                  <span>Estimated Total</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>

              <button
                type="button"
                className="w-full py-2.5 bg-[#1B3821] hover:bg-[#122817] text-white text-[11px] font-semibold uppercase tracking-wider transition rounded-xs cursor-pointer shadow-xs"
              >
                Proceed to Checkout
              </button>

              <div className="pt-2 flex items-center justify-center gap-1.5 text-[10px] text-stone-500">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1B3821]" />
                <span>100% Quality Direct Farm Guarantee</span>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}