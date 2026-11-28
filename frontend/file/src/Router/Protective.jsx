import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { GlobalContext } from "../context/Usecontext.jsx";
import GroceryLoader from "../components/Loading.jsx";

// =========================================================================
// APPROACH:
// Protects authenticated customer routes (Shop, Cart, Orders, Wishlist).
// 1. Shows seamless loading spinner while session check (`curr_user()`) is running.
// 2. If unauthenticated, redirects to `/login` with location state so the user
//    is brought back to their intended page immediately upon signing in.
// =========================================================================

export default function Protection({ children }) {
  const { refresh, user } = useContext(GlobalContext);
  const location = useLocation();

  if (refresh) {
    return <GroceryLoader />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
