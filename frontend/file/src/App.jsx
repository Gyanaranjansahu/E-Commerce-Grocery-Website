import React, { Suspense, lazy } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import GroceryLoader from './components/Loading.jsx';
import Protection from './Router/Protective.jsx';
import AdminProtection from './Router/adminProtection.jsx';
import OurStory from './page/OurStory.jsx';
import LabPurityReport from './page/LabPurityReport.jsx';
import WishlistPage from './wishlist/wishlist.jsx';
import CreateProduct from './Admin/CreateProduct.jsx';
import AdminDashboard from './Admin/adminDashboard.jsx';
import { Toaster } from 'sonner';

// Lazy-loaded route components
const HomePage = lazy(() => import('./page/Home.jsx'));
const SignupUI = lazy(() => import('./page/signup.jsx'));
const Login = lazy(() => import('./page/login.jsx'));
const CollectionPage = lazy(() => import('./page/CollectionPage.jsx'));
const AdminLogin = lazy(() => import('./Admin/admin.jsx'));
const CartPage = lazy(() => import('./cart/cart.jsx'));
const OrderCheckoutPage = lazy(() => import('./page/OrderCheckout.jsx'));
const OrdersPage = lazy(() => import('./page/Orders.jsx'));

// Simple clean 404 fallback
const NotFound = () => (
  <div className="min-h-screen bg-[#FBFBFA] flex flex-col items-center justify-center p-6 text-center">
    <span className="text-4xl font-serif font-bold text-stone-900 mb-2">404</span>
    <h2 className="text-lg font-serif font-semibold text-stone-800 mb-2">Harvest Page Not Found</h2>
    <p className="text-xs text-stone-500 mb-6 max-w-sm">The route you requested does not exist or has been relocated to another section.</p>
    <a href="/" className="px-5 py-2.5 bg-[#1B3821] text-white text-xs font-semibold uppercase tracking-wider rounded-md hover:bg-[#122817] transition">
      Back to Home
    </a>
  </div>
);

const App = () => {
  return (
    <div>
      <Suspense fallback={<GroceryLoader />}>
        <Routes>
          {/* Public Storefront */}
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<CollectionPage />} />
          <Route path="/our-story" element={<OurStory />} />
          <Route path="/purity" element={<LabPurityReport />} />
          <Route path="/wishlist" element={<WishlistPage />} />

          {/* Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<SignupUI />} />

          {/* User Protected Cart & Orders */}
          <Route path="/cart" element={<CartPage />} />
          <Route
            path="/order"
            element={
              <Protection>
                <OrderCheckoutPage />
              </Protection>
            }
          />
          <Route
            path="/orders"
            element={
              <Protection>
                <OrdersPage />
              </Protection>
            }
          />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <AdminProtection>
                <AdminDashboard />
              </AdminProtection>
            }
          />
          <Route
            path="/_upload_Product"
            element={
              <AdminProtection>
                <CreateProduct />
              </AdminProtection>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster position="top-right" richColors closeButton theme="light" visibleToasts={3} />
    </div>
  );
};

export default App;