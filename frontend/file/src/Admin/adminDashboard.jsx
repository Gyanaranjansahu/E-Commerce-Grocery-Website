import React, { useState, useEffect, useContext } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Trash2,
  CheckCircle,
  Truck,
  Clock,
  AlertCircle,
  Upload,
  RefreshCw,
} from "lucide-react";
import { GlobalContext } from "../context/Usecontext.jsx";
import {
  getAllOrders,
  getAllUsers,
  updateOrderStatus,
  deleteProduct,
  create,
} from "../services/api.js";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const NAVIGATION_ITEMS = [
  { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
  { id: "products", name: "Products", icon: Package },
  { id: "orders", name: "Orders", icon: ShoppingBag },
  { id: "customers", name: "Customers", icon: Users },
];

const ORDER_STATUSES = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

const CATEGORIES = [
  "Fruits",
  "Vegetables",
  "Dairy",
  "Meat",
  "Beverages",
  "Snacks",
];

export default function AdminDashboard() {
  const { product, fetchProducts, adminData, handleUserLogout } = useContext(GlobalContext);
  const navigate = useNavigate();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [searchQuery, setSearchQuery] = useState("");

  // Live state
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // New Product Modal/Form State
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProd, setNewProd] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "50",
    category: "Vegetables",
  });
  const [prodFile, setProdFile] = useState(null);
  const [submittingProduct, setSubmittingProduct] = useState(false);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      if (fetchProducts) await fetchProducts();
      const [orderRes, userRes] = await Promise.all([
        getAllOrders(),
        getAllUsers(),
      ]);
      setOrders(orderRes?.orders || []);
      setUsers(userRes?.users || []);
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoading(false);
    }
  }, [fetchProducts]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleLogout = async () => {
    if (handleUserLogout) await handleUserLogout();
    navigate("/admin/login", { replace: true });
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, orderStatus: status } : o))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProd = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(id);
      if (fetchProducts) await fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newProd.name || !newProd.price || !newProd.category) {
      toast.error("Please fill all required fields");
      return;
    }

    setSubmittingProduct(true);
    try {
      await create({
        ...newProd,
        image: prodFile,
      });
      setShowAddProduct(false);
      setNewProd({
        name: "",
        description: "",
        price: "",
        quantity: "50",
        category: "Vegetables",
      });
      setProdFile(null);
      if (fetchProducts) await fetchProducts();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingProduct(false);
    }
  };

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalOrdersCount = orders.length;
  const totalProductsCount = product?.length || 0;
  const totalUsersCount = users.length;

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-stone-800 flex font-sans antialiased overflow-x-hidden selection:bg-emerald-100 selection:text-emerald-900">
      {/* 1. MOBILE BACKDROP */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* 2. SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-stone-950 text-stone-300 flex flex-col justify-between transition-all duration-300 ease-in-out lg:static shrink-0 ${
          mobileSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
        } ${desktopCollapsed ? "lg:w-20" : "lg:w-64"} w-64 border-r border-stone-900`}
      >
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Header */}
          <div className="h-16 px-4 border-b border-stone-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shrink-0 shadow-xs">
                <span className="text-white font-bold text-sm tracking-wider">V</span>
              </div>
              {(!desktopCollapsed || mobileSidebarOpen) && (
                <div className="flex flex-col leading-none truncate">
                  <span className="font-semibold text-sm tracking-wide text-white truncate">
                    VEDA ORGANICS
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-medium mt-0.5">
                    Admin Portal
                  </span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-stone-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5 flex-1 overflow-y-auto">
            {NAVIGATION_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.name;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.name);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full group flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                    isActive
                      ? "bg-emerald-600/15 text-emerald-400 font-semibold"
                      : "text-stone-400 hover:bg-stone-900 hover:text-stone-100"
                  } ${desktopCollapsed ? "lg:justify-center lg:px-0" : ""}`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {(!desktopCollapsed || mobileSidebarOpen) && (
                    <span className="truncate flex-1 text-left">{item.name}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-stone-850 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setDesktopCollapsed(!desktopCollapsed)}
            className="hidden lg:flex items-center justify-center p-2 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-900 transition text-xs cursor-pointer"
          >
            {desktopCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <div className="flex items-center gap-2 w-full px-1">
                <ChevronLeft className="w-4 h-4" />
                <span className="text-stone-400 text-[11px]">Minimize Sidebar</span>
              </div>
            )}
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition cursor-pointer ${
              desktopCollapsed ? "lg:justify-center lg:px-0" : ""
            }`}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {(!desktopCollapsed || mobileSidebarOpen) && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* 3. MAIN DASHBOARD CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 w-full min-h-screen">
        {/* Header */}
        <header className="h-16 bg-white border-b border-stone-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base font-semibold text-stone-900 tracking-tight">
              {activeTab}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={loadData}
              className="p-2 text-stone-600 hover:text-emerald-700 hover:bg-stone-100 rounded-lg transition cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>

            <div className="flex items-center gap-2 p-1 px-2.5 rounded-lg bg-stone-100 text-stone-800 text-xs font-medium">
              <div className="w-6 h-6 rounded-full bg-emerald-800 text-white text-[10px] font-bold flex items-center justify-center">
                A
              </div>
              <span className="hidden sm:inline">{adminData?.name || "Administrator"}</span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === "Dashboard" && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
                  <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                    Total Revenue
                  </span>
                  <span className="text-2xl font-bold text-stone-900 mt-1 block">
                    ₹{totalRevenue.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-emerald-700 font-medium mt-1 inline-block">
                    Direct Farm Income
                  </span>
                </div>

                <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
                  <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                    Total Orders
                  </span>
                  <span className="text-2xl font-bold text-stone-900 mt-1 block">
                    {totalOrdersCount}
                  </span>
                  <span className="text-[11px] text-stone-500 font-medium mt-1 inline-block">
                    {orders.filter((o) => o.orderStatus === "DELIVERED").length} delivered
                  </span>
                </div>

                <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
                  <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                    Active Catalog
                  </span>
                  <span className="text-2xl font-bold text-stone-900 mt-1 block">
                    {totalProductsCount}
                  </span>
                  <span className="text-[11px] text-stone-500 font-medium mt-1 inline-block">
                    Available produce items
                  </span>
                </div>

                <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
                  <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                    Registered Users
                  </span>
                  <span className="text-2xl font-bold text-stone-900 mt-1 block">
                    {totalUsersCount}
                  </span>
                  <span className="text-[11px] text-stone-500 font-medium mt-1 inline-block">
                    Verified customers
                  </span>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-stone-900">
                    Recent Customer Orders
                  </h2>
                  <button
                    onClick={() => setActiveTab("Orders")}
                    className="text-xs text-emerald-800 font-semibold hover:underline cursor-pointer"
                  >
                    View All Orders →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-stone-600">
                    <thead className="bg-stone-50 border-b border-stone-200 uppercase font-semibold text-[10px] text-stone-500">
                      <tr>
                        <th className="py-3 px-4">Order ID</th>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Address</th>
                        <th className="py-3 px-4">Items</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order._id} className="hover:bg-stone-50/50">
                          <td className="py-3 px-4 font-mono font-medium text-stone-900">
                            #{order._id.slice(-6).toUpperCase()}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-stone-900 block">
                              {order.shippingAddress?.name || order.user?.name || "Customer"}
                            </span>
                            <span className="text-[10px] text-stone-500">
                              {order.shippingAddress?.phone || order.user?.phone}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-stone-500 max-w-xs truncate">
                            {order.shippingAddress?.city}, {order.shippingAddress?.pincode}
                          </td>
                          <td className="py-3 px-4">{order.products?.length || 0} items</td>
                          <td className="py-3 px-4 font-bold text-stone-900">
                            ₹{order.totalAmount}
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2.5 py-1 text-[10px] font-semibold rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                              {order.orderStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-stone-400">
                            No orders found yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS MANAGEMENT */}
          {activeTab === "Products" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-stone-200 rounded-xl p-4 sm:p-5 shadow-xs">
                <div>
                  <h2 className="text-base font-semibold text-stone-900">Catalog Inventory</h2>
                  <p className="text-xs text-stone-500">
                    Manage farm produce, prices, categories, and availability
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search produce..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="text-xs pl-8 pr-3 py-1.5 border border-stone-300 rounded-lg outline-none focus:border-emerald-700 bg-stone-50"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAddProduct(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#1B3821] hover:bg-[#122817] text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition cursor-pointer shadow-xs"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Add Product</span>
                  </button>
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(product || [])
                  .filter((p) =>
                    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.category?.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((item) => (
                    <div
                      key={item._id}
                      className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs flex gap-3 items-center justify-between hover:border-stone-300 transition"
                    >
                      <div className="w-16 h-16 rounded-lg bg-stone-100 overflow-hidden border border-stone-200 shrink-0">
                        <img
                          src={item.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=80"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0 pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-bold uppercase bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded border border-stone-200">
                            {item.category}
                          </span>
                        </div>
                        <h4 className="text-xs font-semibold text-stone-900 truncate mt-1">
                          {item.name}
                        </h4>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs font-bold text-stone-900">₹{item.price}</span>
                          <span className="text-[10px] text-stone-500">Stock: {item.quantity || "N/A"}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteProd(item._id)}
                        className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
              </div>

              {/* Add Product Modal */}
              {showAddProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
                  <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 relative border border-stone-200">
                    <button
                      onClick={() => setShowAddProduct(false)}
                      className="absolute top-4 right-4 p-1 text-stone-400 hover:text-stone-700"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    <h3 className="text-lg font-serif font-bold text-stone-900 mb-4">
                      Add New Produce Item
                    </h3>

                    <form onSubmit={handleCreateProduct} className="space-y-4">
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                          Product Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={newProd.name}
                          onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                          placeholder="e.g. Desi Cow Raw Milk"
                          className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-md outline-none focus:border-emerald-900"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                          Description
                        </label>
                        <textarea
                          rows={2}
                          value={newProd.description}
                          onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                          placeholder="Freshly sourced directly from organic farmers..."
                          className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-md outline-none focus:border-emerald-900"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                            Price (₹) *
                          </label>
                          <input
                            type="number"
                            required
                            min="1"
                            value={newProd.price}
                            onChange={(e) => setNewProd({ ...newProd, price: e.target.value })}
                            placeholder="120"
                            className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-md outline-none focus:border-emerald-900"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                            Category *
                          </label>
                          <select
                            value={newProd.category}
                            onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                            className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-md outline-none focus:border-emerald-900"
                          >
                            {CATEGORIES.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                            Stock Units
                          </label>
                          <input
                            type="number"
                            value={newProd.quantity}
                            onChange={(e) => setNewProd({ ...newProd, quantity: e.target.value })}
                            placeholder="50"
                            className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-md outline-none focus:border-emerald-900"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-stone-700 uppercase mb-1">
                          Product Image
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setProdFile(e.target.files?.[0] || null)}
                          className="w-full text-xs p-2 bg-stone-50 border border-stone-300 rounded-md file:mr-3 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:bg-emerald-800 file:text-white"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submittingProduct}
                        className="w-full py-2.5 bg-[#1B3821] hover:bg-[#122817] text-white text-xs font-semibold uppercase tracking-wider rounded-md transition cursor-pointer disabled:opacity-50"
                      >
                        {submittingProduct ? "Publishing..." : "Publish Product"}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ORDERS MANAGEMENT */}
          {activeTab === "Orders" && (
            <div className="bg-white border border-stone-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-stone-900">Customer Orders</h2>
                  <p className="text-xs text-stone-500">
                    Track dispatches, update delivery status, and review addresses
                  </p>
                </div>
                <span className="text-xs font-semibold text-stone-700 bg-stone-100 px-2.5 py-1 rounded">
                  {orders.length} Total Orders
                </span>
              </div>

              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="border border-stone-200 rounded-lg p-4 hover:border-stone-300 transition"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-3">
                      <div>
                        <span className="font-mono text-xs font-bold text-stone-900">
                          #{order._id.slice(-8).toUpperCase()}
                        </span>
                        <span className="text-[11px] text-stone-500 ml-2">
                          {new Date(order.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="text-[11px] font-semibold text-stone-600">
                          Status:
                        </label>
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="text-xs font-semibold p-1 px-2 border border-stone-300 rounded bg-stone-50 cursor-pointer"
                        >
                          {ORDER_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 text-xs">
                      <div>
                        <span className="font-semibold text-stone-800 block mb-1">Customer & Drop Address</span>
                        <p className="text-stone-900 font-medium">
                          {order.shippingAddress?.name || order.user?.name} ({order.shippingAddress?.phone || order.user?.phone})
                        </p>
                        <p className="text-stone-500">
                          {order.shippingAddress?.address}, {order.shippingAddress?.city} - {order.shippingAddress?.pincode}
                        </p>
                        <p className="text-stone-500 mt-1">
                          Payment: <strong>{order.paymentMethod}</strong> ({order.paymentStatus})
                        </p>
                      </div>

                      <div className="md:col-span-2">
                        <span className="font-semibold text-stone-800 block mb-1">Ordered Items</span>
                        <div className="space-y-1.5">
                          {order.products?.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-stone-600 bg-stone-50 p-1.5 px-2.5 rounded">
                              <span>
                                {item.product?.name || "Harvest Product"} × {item.quantity}
                              </span>
                              <span className="font-semibold text-stone-900">
                                ₹{item.price * item.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="text-right mt-2 font-bold text-stone-900 text-sm">
                          Total: ₹{order.totalAmount}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {orders.length === 0 && (
                  <div className="text-center py-12 text-stone-400">
                    No orders have been received yet.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: CUSTOMERS */}
          {activeTab === "Customers" && (
            <div className="bg-white border border-stone-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-stone-900">Registered Community Members</h2>
                  <p className="text-xs text-stone-500">
                    Customers who have registered for morning harvest allocation
                  </p>
                </div>
                <span className="text-xs font-semibold text-stone-700 bg-stone-100 px-2.5 py-1 rounded">
                  {users.length} Users
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-600">
                  <thead className="bg-stone-50 border-b border-stone-200 uppercase font-semibold text-[10px] text-stone-500">
                    <tr>
                      <th className="py-3 px-4">Member</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Phone</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-stone-50/50">
                        <td className="py-3 px-4 flex items-center gap-2">
                          <img
                            src={u.profileImage || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
                            alt={u.name}
                            className="w-7 h-7 rounded-full object-cover border border-stone-200"
                          />
                          <span className="font-semibold text-stone-900">{u.name}</span>
                        </td>
                        <td className="py-3 px-4">{u.email}</td>
                        <td className="py-3 px-4">{u.phone || "N/A"}</td>
                        <td className="py-3 px-4">{u.city || "Odisha"} {u.pin ? `(${u.pin})` : ""}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              u.role === "admin"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-stone-100 text-stone-700"
                            }`}
                          >
                            {u.role?.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-stone-400">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}