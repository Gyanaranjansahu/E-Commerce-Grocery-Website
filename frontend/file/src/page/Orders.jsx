import React, { useEffect, useState } from "react";
import { getMyOrders } from "../services/api.js";
import Navbar from "../components/Nav.jsx";
import Footer from "../components/Footer.jsx";
import { Package, Clock, ArrowLeft, CheckCircle, Truck, Check, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import GroceryLoader from "../components/Loading.jsx";

const statusConfig = {
  PLACED: { label: "Order Placed", bg: "bg-amber-50 text-amber-800 border-amber-200", icon: Clock },
  CONFIRMED: { label: "Confirmed", bg: "bg-blue-50 text-blue-800 border-blue-200", icon: CheckCircle },
  SHIPPED: { label: "Dispatched & On the Way", bg: "bg-indigo-50 text-indigo-800 border-indigo-200", icon: Truck },
  DELIVERED: { label: "Delivered at Doorstep", bg: "bg-emerald-50 text-emerald-800 border-emerald-200", icon: Check },
  CANCELLED: { label: "Cancelled", bg: "bg-rose-50 text-rose-800 border-rose-200", icon: AlertCircle },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        setLoading(true);
        const res = await getMyOrders();
        setOrders(res?.orders || []);
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#1E221E] font-sans antialiased flex flex-col justify-between">
      <div>
        <Navbar />

        <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-stone-200">
            <div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#1B3821] uppercase block mb-1">
                Farm Allocations & Drops
              </span>
              <h1 className="text-2xl font-serif font-bold text-stone-900">My Orders</h1>
              <p className="text-xs text-stone-500 mt-1">
                Track your morning harvest dispatches and past deliveries
              </p>
            </div>
            <Link
              to="/shop"
              className="text-xs font-semibold uppercase tracking-wider text-[#1B3821] hover:underline flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
            </Link>
          </div>

          {loading ? (
            <div className="py-20 flex justify-center">
              <GroceryLoader />
            </div>
          ) : orders.length === 0 ? (
            <div className="py-20 text-center bg-white border border-stone-200 rounded-lg p-8 mt-6">
              <Package className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h2 className="text-base font-serif font-semibold text-stone-800">
                You haven't placed any orders yet
              </h2>
              <p className="text-xs text-stone-500 mt-1 mb-6">
                Explore our fresh unpasteurized milk, cold-pressed oils, and farm vegetables.
              </p>
              <Link
                to="/shop"
                className="inline-block px-6 py-2.5 bg-[#1B3821] text-white text-xs font-semibold uppercase tracking-wider rounded-md hover:bg-[#122817] transition shadow-xs"
              >
                Browse Catalog
              </Link>
            </div>
          ) : (
            <div className="space-y-6 mt-6">
              {orders.map((order) => {
                const statusMeta = statusConfig[order.orderStatus] || statusConfig.PLACED;
                const StatusIcon = statusMeta.icon;

                return (
                  <div
                    key={order._id}
                    className="bg-white border border-stone-200 rounded-lg p-5 sm:p-6 shadow-xs hover:border-stone-300 transition"
                  >
                    {/* Top Row: ID, Date, Status */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4">
                      <div>
                        <span className="text-[10px] font-mono text-stone-400 block uppercase">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </span>
                        <span className="text-xs text-stone-500">
                          Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusMeta.bg}`}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          {statusMeta.label}
                        </span>
                      </div>
                    </div>

                    {/* Products in this order */}
                    <div className="divide-y divide-stone-100 py-3">
                      {order.products?.map((item, idx) => {
                        const product = item.product || {};
                        return (
                          <div key={idx} className="py-3 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="w-14 h-14 bg-stone-100 rounded-md overflow-hidden border border-stone-200 shrink-0">
                                <img
                                  src={
                                    product.image ||
                                    "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=80"
                                  }
                                  alt={product.name || "Product"}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <h4 className="text-xs sm:text-sm font-semibold text-stone-900 line-clamp-1">
                                  {product.name || "Harvest Staple"}
                                </h4>
                                <span className="text-[11px] text-stone-500 block">
                                  Qty: {item.quantity} × ₹{item.price}
                                </span>
                              </div>
                            </div>
                            <span className="text-xs sm:text-sm font-bold text-stone-900 shrink-0">
                              ₹{item.price * item.quantity}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Bottom Details: Address & Total */}
                    <div className="border-t border-stone-100 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="text-stone-600">
                        <span className="font-semibold text-stone-800 block mb-0.5">
                          Delivery to:
                        </span>
                        <span>
                          {order.shippingAddress?.name} • {order.shippingAddress?.phone}
                        </span>
                        <span className="block text-stone-500">
                          {order.shippingAddress?.address}, {order.shippingAddress?.city} - {order.shippingAddress?.pincode}
                        </span>
                        <span className="inline-block mt-1 text-[11px] font-medium text-stone-500">
                          Payment: <strong>{order.paymentMethod}</strong> ({order.paymentStatus})
                        </span>
                      </div>

                      <div className="sm:text-right">
                        <span className="text-stone-500 text-[11px] block">Grand Total</span>
                        <span className="text-base sm:text-lg font-bold text-[#1B3821]">
                          ₹{order.totalAmount}
                        </span>
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
