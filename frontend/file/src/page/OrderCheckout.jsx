import React, { useContext, useState, useEffect } from "react";
import {
  Banknote,
  Truck,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Sparkles,
  ShoppingBag,
  MapPin,
  Phone,
  User as UserIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Nav.jsx";
import Footer from "../components/Footer.jsx";
import { GlobalContext } from "../context/Usecontext.jsx";
import Costume from "../services/costume.js";
import { toast } from "sonner";

export default function OrderCheckout() {
  const { cart, user, fetchCart } = useContext(GlobalContext);
  const { handleCreateOrder, loading } = Costume();
  const navigate = useNavigate();

  // Normalize cart items
  const cartItems = Array.isArray(cart)
    ? cart
    : Array.isArray(cart?.products)
      ? cart.products
      : [];

  const [address, setAddress] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: [user?.flat, user?.landmark].filter(Boolean).join(", ") || "",
    city: user?.city || "Bhubaneswar",
    state: "Odisha",
    pincode: user?.pin || "",
  });

  // Re-sync with user profile if available
  useEffect(() => {
    if (user) {
      setAddress((prev) => ({
        name: prev.name || user.name || "",
        phone: prev.phone || user.phone || "",
        address: prev.address || [user.flat, user.landmark].filter(Boolean).join(", ") || "",
        city: prev.city || user.city || "Bhubaneswar",
        state: prev.state || "Odisha",
        pincode: prev.pincode || user.pin || "",
      }));
    }
  }, [user]);

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => {
    const price =
      typeof item.productId === "object"
        ? item.productId?.price || 0
        : item.price || 0;
    return acc + price * (item.quantity || 1);
  }, 0);

  const delivery = subtotal > 500 || subtotal === 0 ? 0 : 40;
  const totalAmount = subtotal + delivery;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!address.name || !address.phone || !address.address || !address.city || !address.pincode) {
      toast.error("Please complete all shipping address fields");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your basket is empty. Add products before placing an order.");
      navigate("/shop");
      return;
    }

    try {
      const payload = {
        shippingAddress: address,
        paymentMethod: "COD", // Strict Cash on Delivery Only
      };

      const res = await handleCreateOrder(payload);
      if (res?.success) {
        if (fetchCart) await fetchCart();
        navigate("/orders", { replace: true });
      }
    } catch (err) {
      console.error("Order placement failed:", err);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#FBFBFA] flex flex-col justify-between">
        <Navbar />
        <main className="max-w-xl mx-auto px-4 py-20 text-center">
          <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h2 className="text-lg font-serif font-bold text-stone-900">Your basket is empty</h2>
          <p className="text-xs text-stone-500 mt-1 mb-6">
            Please select items from the farm catalog before shifting to checkout.
          </p>
          <Link
            to="/shop"
            className="px-6 py-2.5 bg-[#1B3821] text-white text-xs font-semibold uppercase tracking-wider rounded-md hover:bg-[#122817] transition"
          >
            Browse Harvest Catalog
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#1E221E] font-sans antialiased flex flex-col justify-between">
      <div>
        <Navbar />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Top Breadcrumb Header */}
          <div className="flex items-center justify-between border-b border-stone-200 pb-4">
            <div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#1B3821] uppercase block mb-1">
                Final Step • Doorstep Allocation
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                Confirm Order & Delivery
              </h1>
            </div>
            <Link
              to="/cart"
              className="text-xs font-semibold text-[#1B3821] hover:underline flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Basket
            </Link>
          </div>

          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Address & Payment (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Delivery Address Card */}
              <div className="bg-white border border-stone-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                  <MapPin className="w-4 h-4 text-[#1B3821]" />
                  <h2 className="text-sm font-serif font-bold text-stone-900 uppercase tracking-wider">
                    1. Shipping & Doorstep Address
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={address.name}
                        onChange={(e) => setAddress({ ...address, name: e.target.value })}
                        placeholder="e.g. Gyana Ranjan"
                        className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-lg outline-none focus:border-emerald-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      placeholder="e.g. +91 78468 13554"
                      className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-lg outline-none focus:border-emerald-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                    House / Flat No, Street, Landmark *
                  </label>
                  <input
                    type="text"
                    required
                    value={address.address}
                    onChange={(e) => setAddress({ ...address, address: e.target.value })}
                    placeholder="e.g. Flat 302, Green Valley Apartments, Near Mandi"
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-lg outline-none focus:border-emerald-800"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-lg outline-none focus:border-emerald-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-lg outline-none focus:border-emerald-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      required
                      value={address.pincode}
                      onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                      placeholder="751001"
                      className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-lg outline-none focus:border-emerald-800"
                    />
                  </div>
                </div>
              </div>

              {/* PAYMENT METHOD: STRICT CASH ON DELIVERY ONLY */}
              <div className="bg-white border-2 border-[#1B3821] rounded-xl p-5 sm:p-6 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Banknote className="w-5 h-5 text-[#1B3821]" />
                    <h2 className="text-sm font-serif font-bold text-stone-900 uppercase tracking-wider">
                      2. Payment Method
                    </h2>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded">
                    Cash On Delivery Only
                  </span>
                </div>

                <div className="p-4 bg-[#F5F8F5] border border-[#CBE0CE] rounded-lg flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#1B3821] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-[#161B16] uppercase tracking-wide">
                      Cash on Delivery (COD) Selected
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Pay easily in cash at the time of morning harvest delivery at your doorstep (6:30 AM drop).
                      No online prepayments or bank transfers required.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 text-[11px] text-stone-500">
                  <Clock className="w-3.5 h-3.5 text-[#1B3821]" />
                  <span>Morning delivery cut-off: Orders placed before 9:00 PM arrive tomorrow morning.</span>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Confirmation (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-4 sticky top-28">
                <h3 className="text-xs font-serif font-bold text-stone-900 uppercase tracking-wider border-b border-stone-100 pb-3">
                  Harvest Basket Review ({cartItems.length} items)
                </h3>

                {/* Items preview list */}
                <div className="max-h-60 overflow-y-auto divide-y divide-stone-100 pr-1 space-y-2">
                  {cartItems.map((item, idx) => {
                    const product = typeof item.productId === "object" ? item.productId : item;
                    if (!product) return null;

                    return (
                      <div key={product._id || idx} className="pt-2 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={product.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=80"}
                            alt={product.name}
                            className="w-10 h-10 rounded-md object-cover border border-stone-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-stone-900 truncate text-[11px]">
                              {product.name}
                            </p>
                            <p className="text-[10px] text-stone-500">
                              Qty: {item.quantity || 1} × ₹{product.price}
                            </p>
                          </div>
                        </div>
                        <span className="font-bold text-stone-900 text-[11px] shrink-0">
                          ₹{(product.price || 0) * (item.quantity || 1)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Pricing calculations */}
                <div className="border-t border-stone-100 pt-3 space-y-2 text-xs text-stone-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-stone-900">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Dawn Delivery</span>
                    <span>
                      {delivery === 0 ? (
                        <span className="text-emerald-700 font-semibold text-[10px] uppercase tracking-wider">
                          Free
                        </span>
                      ) : (
                        `₹${delivery}`
                      )}
                    </span>
                  </div>
                  <div className="border-t border-stone-100 pt-3 flex justify-between text-base font-bold text-stone-900">
                    <span>Grand Total Payable</span>
                    <span className="text-[#1B3821]">₹{totalAmount}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#1B3821] hover:bg-[#122817] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition cursor-pointer shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Banknote className="w-4 h-4" />
                  <span>{loading ? "Placing Order..." : "Confirm Order (Cash on Delivery)"}</span>
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[10px] text-stone-500 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#1B3821]" />
                  <span>100% Quality & Fresh Harvest Guarantee</span>
                </div>
              </div>
            </div>
          </form>
        </main>
      </div>

      <Footer />
    </div>
  );
}

