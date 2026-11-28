import React, { Suspense, lazy } from 'react';
import { Route, Routes, Navigate, Link } from 'react-router-dom';
import GroceryLoader from './components/Loading.jsx';
import Protection from './Router/Protective.jsx';
import AdminProtection from './Router/adminProtection.jsx';
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
const ForgotPassword = lazy(() => import('./page/ForgotPassword.jsx'));
const Logout = lazy(() => import('./page/Logout.jsx'));
const OurStory = lazy(() => import('./page/OurStory.jsx'));
const LabPurityReport = lazy(() => import('./page/LabPurityReport.jsx'));
const WishlistPage = lazy(() => import('./wishlist/wishlist.jsx'));
const CreateProduct = lazy(() => import('./Admin/CreateProduct.jsx'));
const AdminDashboard = lazy(() => import('./Admin/adminDashboard.jsx'));
const Terms = lazy(() => import('./page/Terms.jsx'));

// 404 Fallback page
const NotFound = () => (
  <div className="min-h-screen bg-[#FBFBFA] flex flex-col items-center justify-center p-6 text-center">
    <span className="text-4xl font-serif font-bold text-emerald-950 mb-2">404</span>
    <h2 className="text-lg font-serif font-semibold text-stone-800 mb-2">Harvest Page Not Found</h2>
    <p className="text-xs text-stone-500 mb-6 max-w-sm">The route you requested does not exist or has been relocated to another section.</p>
    <Link to="/" className="px-5 py-2.5 bg-[#1B3821] text-white text-xs font-semibold uppercase tracking-wider rounded-md hover:bg-[#122817] transition">
      Back to Home
    </Link>
  </div>
);

const App = () => {
  return (
    <div>
      <Suspense fallback={<GroceryLoader />}>
        <Routes>
          {/* Public Storefront */}
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={
            <Protection>
              <CollectionPage />
            </Protection>
          } />
          <Route path="/subscription" element={<Navigate to="/shop" replace />} />
          <Route path="/subscriptions" element={<Navigate to="/shop" replace />} />
          <Route path="/our-story" element={<OurStory />} />
          <Route path="/purity" element={<LabPurityReport />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/terms-and-conditions" element={<Terms />} />
          <Route path="/terms-of-condition" element={<Terms />} />

          {/* User Protected Routes */}
          <Route path="/wishlist" element={
            <Protection>
              <WishlistPage />
            </Protection>
          } />
          <Route path="/cart" element={
            <Protection>
              <CartPage />
            </Protection>
          } />
          <Route path="/order" element={
            <Protection>
              <OrderCheckoutPage />
            </Protection>
          } />
          <Route path="/orders" element={
            <Protection>
              <OrdersPage />
            </Protection>
          } />

          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<SignupUI />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ForgotPassword />} />
          <Route path="/change-password" element={<ForgotPassword />} />
          <Route path="/logout" element={<Logout />} />

          {/* Admin Routes with Aliases */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/Admin_login" element={<Navigate to="/admin/login" replace />} />
          <Route path="/adminLogin" element={<Navigate to="/admin/login" replace />} />

          <Route
            path="/admin/dashboard"
            element={
              <AdminProtection>
                <AdminDashboard />
              </AdminProtection>
            }
          />
          <Route
            path="/admin/dashboard/create-product"
            element={
              <AdminProtection>
                <CreateProduct />
              </AdminProtection>
            }
          />
          <Route
            path="/admin/dashboard/create"
            element={
              <AdminProtection>
                <CreateProduct />
              </AdminProtection>
            }
          />

          <Route
            path="/adminDashboard"
            element={<Navigate to="/admin/dashboard" replace />}
          />
          <Route
            path="/_upload_Product"
            element={
              <AdminProtection>
                <CreateProduct />
              </AdminProtection>
            }
          />

          {/* 404 Catch-All */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster position="top-right" richColors closeButton theme="light" visibleToasts={3} />
    </div>
  );
};

export default App;
