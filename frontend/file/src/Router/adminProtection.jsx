import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { GlobalContext } from '../context/Usecontext.jsx';
import GroceryLoader from '../components/Loading.jsx';

// =========================================================================
// APPROACH:
// Protects admin dashboard and product management routes.
// 1. Waits if authentication / admin verification is actively refreshing.
// 2. Checks if the user holds role="admin" via either `user` or `adminData`.
// 3. Gracefully redirects unauthorized users to `/admin/login` preserving route state.
// =========================================================================

const AdminProtection = ({ children }) => {
  const { adminRefresh, adminData, user, refresh } = useContext(GlobalContext);
  const location = useLocation();

  if (refresh || adminRefresh) {
    return <GroceryLoader />;
  }

  const isAdmin = user?.role === "admin" || adminData?.admin?.role === "admin";

  if (!isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminProtection;
