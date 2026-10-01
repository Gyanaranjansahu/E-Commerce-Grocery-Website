import React, { useContext, useState } from "react";
import {
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ShieldCheck,
  ShoppingBag,
  CheckCircle2,
  X,
  Truck,
  CreditCard,
} from "lucide-react";
import Navbar from "../components/Nav.jsx";
import { GlobalContext } from "../context/Usecontext.jsx";
import Costume from "../services/costume.js";
import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
export default function CartPage() {
  const { cart, setCart, total: cartCount, setTotal, user, fetchCart } = useContext(GlobalContext);
  const navigate = useNavigate();

  // Hook methods connected to backend API
  const { handleCartUpdate, handleDeleteItem, handleCreateOrder, loading: orderLoading } = Costume();

  // Checkout Modal State
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [address, setAddress] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: [user?.flat, user?.landmark].filter(Boolean).join(", ") || "",
    city: user?.city || "Bhubaneswar",
    state: "Odisha",
    pincode: user?.pin || "",
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");

  // Normalize cart items: array format or populated mongoose document
  const cartItems = Array.isArray(cart)
    ? cart
    : Array.isArray(cart?.products)
      ? cart.products
      : [];

  // ========================================================
  // 1. UPDATE QUANTITY (+1 / -1) WITH BACKEND SYNC
  // ========================================================
  const handleQuantity = async (productId, delta) => {
    const previousCart = cart;
    let targetNewQty = null;

    const currentItem = cartItems.find((item) => {
      const id = item.productId?._id || item.productId || item._id;
      return String(id) === String(productId);
    });

    if (!currentItem) return;

    const currentQty = currentItem.quantity || 1;
    const nextQty = currentQty + delta;

    if (nextQty <= 0) {
      await handleRemove(productId);
      return;
    }

    targetNewQty = nextQty;

    // Optimistic UI update
    setCart((prev) => {
      const items = Array.isArray(prev) ? prev : prev?.products || [];
      const updated = items.map((item) => {
        const id = item.productId?._id || item.productId || item._id;
        if (String(id) === String(productId)) {
          return { ...item, quantity: targetNewQty };
        }
        return item;
      });

      return Array.isArray(prev) ? updated : { ...prev, products: updated };
    });

    try {
      await handleCartUpdate(productId, targetNewQty);
    } catch (error) {
      console.error("Failed to update cart quantity on backend:", error.message);
      setCart(previousCart);
    }
  };

  // ========================================================
  // 2. REMOVE ITEM FROM CART WITH BACKEND SYNC
  // ========================================================
  const handleRemove = async (productId) => {
    const previousCart = cart;
    const previousCount = cartCount;

    setCart((prev) => {
      const items = Array.isArray(prev) ? prev : prev?.products || [];
      const updated = items.filter((item) => {
        const id = item.productId?._id || item.productId || item._id;
        return String(id) !== String(productId);
      });

      if (setTotal) {
        setTotal(Math.max(0, updated.length));
      }

      return Array.isArray(prev) ? updated : { ...prev, products: updated };
    });

    try {
      await handleDeleteItem(productId);
    } catch (error) {
      console.error("Failed to delete cart item on backend:", error.message);
      setCart(previousCart);
      if (setTotal && previousCount !== undefined) {
        setTotal(previousCount);
      }
    }
  };

  // Dynamic calculations
  const subtotal = cartItems.reduce((acc, item) => {
    const price = typeof item.productId === "object" ? item.productId?.price || 0 : item.price || 0;
    return acc + price * (item.quantity || 1);
  }, 0);

  const delivery = subtotal > 500 || subtotal === 0 ? 0 : 40;
  const totalAmount = subtotal + delivery;

  // ========================================================
  // 3. CHECKOUT & PLACE ORDER
  // ========================================================
  const handleStartCheckout = () => {
    if (!user) {
      navigate("/login", { state: { from: { pathname: "/cart" } } });
      return;
    }
    // Update prefill if user details changed
    setAddress({
      name: user.name || "",
      phone: user.phone || "",
      address: [user.flat, user.landmark].filter(Boolean).join(", ") || "",
      city: user.city || "Bhubaneswar",
      state: "Odisha",
      pincode: user.pin || "",
    });
    setCheckoutOpen(true);
  };

  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    if (!address.name || !address.phone || !address.address || !address.city || !address.pincode) {
      return;
    }

    try {
      const orderPayload = {
        shippingAddress: address,
        paymentMethod,
      };

      const res = await handleCreateOrder(orderPayload);
      if (res?.success) {
        setCheckoutOpen(false);
        if (fetchCart) await fetchCart();
        navigate("/orders");
      }
    } catch (err) {
      console.error("Order placement failed:", err);
    }
  };

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
            to="/shop"
            className="text-xs font-semibold text-[#1B3821] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
          </Link>
        </div>

        {/* Empty State vs Products Grid */}
        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-white border border-[#EAE8E1] p-8 rounded-lg space-y-3">
            <ShoppingBag className="w-10 h-10 text-stone-400 mx-auto stroke-[1.25]" />
            <h2 className="text-base font-serif font-semibold text-stone-800">Your basket is empty</h2>
            <p className="text-xs text-stone-500">Explore our farm harvest and add fresh staples to your cart.</p>
            <Link
              to="/shop"
              className="inline-block mt-2 px-5 py-2.5 bg-[#1B3821] text-white text-xs font-semibold uppercase tracking-wider rounded-md hover:bg-[#122817] transition"
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
                    className="bg-white border border-[#EAE8E1] hover:border-stone-300 p-3 sm:p-4 rounded-lg flex gap-3 sm:gap-4 items-center justify-between transition shadow-xs"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-[#F4F3EE] rounded-md overflow-hidden shrink-0 border border-stone-100">
                      <img
                        src={product.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=80"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      {product.category && (
                        <span className="absolute top-1 left-1 bg-white/95 text-[#1B3821] text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border border-[#E4E1D7]">
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
                      <div className="flex items-center border border-stone-200 rounded-md bg-[#FBFBFA]">
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
                        className="p-1.5 text-stone-400 hover:text-rose-600 transition cursor-pointer"
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
            <div className="bg-white border border-[#EAE8E1] p-4 sm:p-5 rounded-lg space-y-4 shadow-xs sticky top-28">
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
                        Free (Above ₹500)
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
                onClick={handleStartCheckout}
                className="w-full py-3 bg-[#1B3821] hover:bg-[#122817] text-white text-xs font-semibold uppercase tracking-wider transition rounded-md cursor-pointer shadow-xs"
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

        {/* CHECKOUT MODAL */}
        {checkoutOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 relative border border-stone-200">
              <button
                onClick={() => setCheckoutOpen(false)}
                className="absolute top-4 right-4 p-1 text-stone-400 hover:text-stone-700 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-5">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest block">
                  Step 2 of 2: Dispatch Confirmation
                </span>
                <h2 className="text-xl font-serif font-bold text-stone-900 mt-1">
                  Delivery Address & Payment
                </h2>
                <p className="text-xs text-stone-500">
                  We harvest and pack in sterile glass & cloth containers before 6:00 AM.
                </p>
              </div>

              <form onSubmit={handleConfirmOrder} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                      Recipient Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={address.name}
                      onChange={(e) => setAddress({ ...address, name: e.target.value })}
                      className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-md outline-none focus:border-emerald-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-md outline-none focus:border-emerald-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                    Street Address / Flat / Landmark *
                  </label>
                  <input
                    type="text"
                    required
                    value={address.address}
                    onChange={(e) => setAddress({ ...address, address: e.target.value })}
                    placeholder="Flat 204, Green Heights, Patia"
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-md outline-none focus:border-emerald-900"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-md outline-none focus:border-emerald-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-md outline-none focus:border-emerald-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      required
                      value={address.pincode}
                      onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                      className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-md outline-none focus:border-emerald-900"
                    />
                  </div>
                </div>

                {/* Payment Selection */}
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-2">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label
                      className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition ${
                        paymentMethod === "COD"
                          ? "border-[#1B3821] bg-emerald-50/50"
                          : "border-stone-200 hover:bg-stone-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="COD"
                        checked={paymentMethod === "COD"}
                        onChange={() => setPaymentMethod("COD")}
                        className="accent-[#1B3821]"
                      />
                      <div>
                        <span className="block text-xs font-semibold text-stone-900">
                          Cash on Delivery
                        </span>
                        <span className="text-[10px] text-stone-500">Pay at dawn delivery</span>
                      </div>
                    </label>

                    <label
                      className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition ${
                        paymentMethod === "UPI"
                          ? "border-[#1B3821] bg-emerald-50/50"
                          : "border-stone-200 hover:bg-stone-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="UPI"
                        checked={paymentMethod === "UPI"}
                        onChange={() => setPaymentMethod("UPI")}
                        className="accent-[#1B3821]"
                      />
                      <div>
                        <span className="block text-xs font-semibold text-stone-900">
                          UPI / QR Code
                        </span>
                        <span className="text-[10px] text-stone-500">Google Pay / PhonePe</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Total Summary */}
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg flex justify-between items-center text-xs">
                  <span className="text-stone-600">Total Payable ({cartItems.length} items):</span>
                  <span className="text-sm font-bold text-stone-900">₹{totalAmount}</span>
                </div>

                <button
                  type="submit"
                  disabled={orderLoading}
                  className="w-full py-3 bg-[#1B3821] hover:bg-[#122817] text-white text-xs font-semibold uppercase tracking-wider rounded-md transition cursor-pointer disabled:opacity-50"
                >
                  {orderLoading ? "Confirming Order..." : "Confirm & Place Order"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}