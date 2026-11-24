import React, { useState } from "react";
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
  Plus,
  TrendingUp,
  ArrowUpRight
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");

  const navigationItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Products", icon: Package },
    { name: "Orders", icon: ShoppingBag },
    { name: "Customers", icon: Users },
    { name: "Analytics", icon: BarChart3 },
    { name: "Settings", icon: Settings },
  ];

  const recentOrders = [
    { id: "ORD-9012", customer: "Ananya Sharma", items: "A2 Gir Cow Milk, Ghee", total: "₹1,030", status: "Delivered", date: "Today, 09:40 AM" },
    { id: "ORD-9013", customer: "Rohan Verma", items: "Valencia Oranges, Makhana", total: "₹360", status: "Processing", date: "Today, 11:15 AM" },
    { id: "ORD-9014", customer: "Pooja Das", items: "Hydroponic Palak, Desi Eggs", total: "₹185", status: "Out for Delivery", date: "Today, 01:20 PM" },
    { id: "ORD-9015", customer: "Kabir Mehta", items: "Alphonso Mangoes (1 Doz)", total: "₹1,150", status: "Confirmed", date: "Yesterday" },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9F7] text-stone-800 flex font-sans antialiased overflow-x-hidden">
      
      {/* 1. MOBILE BACKDROP OVERLAY */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* 2. RESPONSIVE SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-stone-950 text-stone-300 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 shrink-0 ${
          sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="h-16 px-5 border-b border-stone-800/80 flex items-center justify-between">
            <Link to="/" className="flex flex-col">
              <span className="font-serif text-lg font-bold tracking-wider text-white">
                VEDA ORGANICS
              </span>
              <span className="text-[9px] uppercase tracking-widest text-emerald-400 font-semibold">
                Control Panel
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-md text-stone-400 hover:text-white hover:bg-stone-900 transition"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="p-3 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.name;
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.name);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-md text-xs font-medium transition ${
                    isActive
                      ? "bg-emerald-900/90 text-white font-semibold shadow-xs"
                      : "text-stone-400 hover:bg-stone-900 hover:text-stone-200"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-emerald-300" : "text-stone-400"}`} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Aside Footer / Sign Out */}
        <div className="p-3 border-t border-stone-900">
          <button
            type="button"
            onClick={() => navigate("/admin/login")}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-md text-xs text-red-400 hover:bg-red-950/40 hover:text-red-300 transition"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 3. MAIN DASHBOARD CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 w-full">
        
        {/* TOP HEADER */}
        <header className="h-16 bg-white border-b border-stone-200 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-stone-600 hover:bg-stone-100 rounded-md transition"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-sm sm:text-base font-semibold text-stone-900 truncate">
              {activeTab}
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Desktop Search */}
            <div className="relative hidden md:block w-56 lg:w-72">
              <input
                type="text"
                placeholder="Search orders, SKU, customers..."
                className="w-full bg-stone-50 text-xs py-2 pl-8 pr-3 border border-stone-200 rounded-full focus:outline-none focus:border-emerald-800 focus:bg-white transition"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Mobile Search Toggle */}
            <button
              type="button"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="md:hidden p-2 text-stone-600 hover:bg-stone-100 rounded-full"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Notifications */}
            <button
              type="button"
              className="relative p-2 text-stone-600 hover:bg-stone-100 rounded-full"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-600 rounded-full ring-2 ring-white" />
            </button>

            {/* Admin Avatar Pill */}
            <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
              <div className="w-8 h-8 rounded-full bg-emerald-950 text-emerald-200 text-xs font-bold flex items-center justify-center border border-emerald-800">
                A
              </div>
              <div className="hidden sm:block leading-tight">
                <span className="text-xs font-semibold text-stone-900 block">
                  Admin
                </span>
                <span className="text-[10px] text-stone-500">Superuser</span>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Expandable Search Bar */}
        {mobileSearchOpen && (
          <div className="md:hidden px-4 py-2.5 bg-stone-100 border-b border-stone-200">
            <div className="relative">
              <input
                type="text"
                placeholder="Search orders, items, SKU..."
                className="w-full bg-white text-xs py-2 pl-8 pr-3 border border-stone-300 rounded-md focus:outline-none focus:border-emerald-800"
                autoFocus
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        )}

        {/* DASHBOARD BODY */}
        <main className="p-3 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          
          {/* Quick Metrics Grid (1-col on mobile, 2-col on tablet, 4-col on desktop) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white border border-stone-200 p-4 rounded-sm shadow-2xs">
              <span className="text-[10px] font-bold uppercase text-stone-500 tracking-wider">
                Total Revenue
              </span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-xl sm:text-2xl font-bold text-stone-900">₹42,850</span>
                <span className="inline-flex items-center text-xs text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                  <TrendingUp className="w-3 h-3 mr-0.5" /> +14.2%
                </span>
              </div>
            </div>

            <div className="bg-white border border-stone-200 p-4 rounded-sm shadow-2xs">
              <span className="text-[10px] font-bold uppercase text-stone-500 tracking-wider">
                Today's Orders
              </span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-xl sm:text-2xl font-bold text-stone-900">28</span>
                <span className="text-xs text-stone-500">6 dispatched</span>
              </div>
            </div>

            <div className="bg-white border border-stone-200 p-4 rounded-sm shadow-2xs">
              <span className="text-[10px] font-bold uppercase text-stone-500 tracking-wider">
                Catalog Items
              </span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-xl sm:text-2xl font-bold text-stone-900">30 SKU</span>
                <span className="text-xs text-amber-700 font-medium bg-amber-50 px-1.5 py-0.5 rounded">3 low stock</span>
              </div>
            </div>

            <div className="bg-white border border-stone-200 p-4 rounded-sm shadow-2xs">
              <span className="text-[10px] font-bold uppercase text-stone-500 tracking-wider">
                Subscribers
              </span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-xl sm:text-2xl font-bold text-stone-900">114</span>
                <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">+8 this week</span>
              </div>
            </div>
          </div>

          {/* Orders Section with Scrollable Responsive Table */}
          <div className="bg-white border border-stone-200 shadow-2xs rounded-sm">
            <div className="p-3.5 sm:p-4 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-stone-900">Recent Dispatches</h2>
                <p className="text-[11px] text-stone-500">Real-time farm fresh order activity</p>
              </div>
              <button
                type="button"
                className="self-start sm:self-auto px-3 py-1.5 bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-medium rounded-sm flex items-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Product</span>
              </button>
            </div>

            {/* Overflow wrapper to make table swipeable on phones without breaking the screen */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs min-w-[580px]">
                <thead>
                  <tr className="bg-stone-50/80 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Products</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Time</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-stone-50/50 transition">
                      <td className="p-3 font-semibold text-stone-900">{order.id}</td>
                      <td className="p-3 font-medium text-stone-800">{order.customer}</td>
                      <td className="p-3 text-stone-500 max-w-[200px] truncate">{order.items}</td>
                      <td className="p-3 font-semibold text-stone-900">{order.total}</td>
                      <td className="p-3 text-stone-500 text-[11px] whitespace-nowrap">{order.date}</td>
                      <td className="p-3 whitespace-nowrap">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          order.status === "Delivered"
                            ? "bg-emerald-100 text-emerald-800"
                            : order.status === "Processing"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-100 text-blue-800"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 border-t border-stone-100 text-center sm:text-right">
              <button
                type="button"
                className="text-xs font-semibold text-emerald-900 hover:text-emerald-700 inline-flex items-center gap-1"
              >
                <span>View all orders</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </main>
      </div>

    </div>
  );
}