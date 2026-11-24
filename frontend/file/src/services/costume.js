import { useState } from "react";
import { 
  Login, 
  signup, 
  logout,
  sendOtp, 
  verifyOtp, 
  changePassword,
  addtoCart, 
  Cartupdate, 
  deleteItem, 
  toogleWishlist, 
  create,
  createOrder
} from "./api.js";

// =========================================================================
// APPROACH:
// `Costume` is a lightweight custom hook designed to manage loading states
// across asynchronous actions (login, signup, OTP, cart, product creation).
// It keeps UI components simple so they don't have to duplicate `setLoading(true)`
// and `setLoading(false)` everywhere.
// =========================================================================

export default function Costume() {
  const [loading, setLoading] = useState(false);

  // Wrapper helper to execute async functions with automatic loading state
  const executeWithLoading = async (asyncFn) => {
    setLoading(true);
    try {
      return await asyncFn();
    } finally {
      setLoading(false);
    }
  };

  // 1. Authentication
  const handleSignup = (data) => executeWithLoading(() => signup(data));
  const handleLogin = (credentials) => executeWithLoading(() => Login(credentials));
  const handleLogout = () => executeWithLoading(() => logout());

  // 2. OTP & Password Reset
  const handleSendOtp = (email) => executeWithLoading(() => sendOtp(email));
  const handleVerifyOtp = (payload) => executeWithLoading(() => verifyOtp(payload));
  const handleChangePassword = (payload) => executeWithLoading(() => changePassword(payload));

  // 3. Cart & Wishlist Actions
  const handleCart = (productId) => executeWithLoading(() => addtoCart(productId));
  const handleCartUpdate = (productId, quantity) => executeWithLoading(() => Cartupdate(productId, quantity));
  const handleDeleteItem = (productId) => executeWithLoading(() => deleteItem(productId));
  const handleWish = (itemId) => executeWithLoading(() => toogleWishlist(itemId));

  // 4. Admin Product Creation & Orders
  const handleCreate = (data) => executeWithLoading(() => create(data));
  const handleCreateOrder = (data) => executeWithLoading(() => createOrder(data));

  return {
    loading,
    handleSignup,
    handleLogin,
    handleLogout,
    handleSendOtp,
    handleVerifyOtp,
    handleChangePassword,
    handleCart,
    handleCartUpdate,
    handleDeleteItem,
    handleWish,
    handleCreate,
    handleCreateOrder,
  };
}
