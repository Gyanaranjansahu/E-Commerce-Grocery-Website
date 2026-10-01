import { useState } from "react";
import {
  addtoCart,
  Login,
  signup,
  logoutUser,
  Cartupdate,
  deleteItem,
  clearCartApi,
  toogleWishlist,
  deleteWishItem,
  create,
  deleteProduct,
  createOrder,
} from "./api.js";

export default function Costume() {
  const [loading, setLoading] = useState(false);

  async function handleSignup(data) {
    setLoading(true);
    try {
      const res = await signup(data);
      return res;
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(data) {
    setLoading(true);
    try {
      const res = await Login(data);
      return res;
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    setLoading(true);
    try {
      const res = await logoutUser();
      return res;
    } finally {
      setLoading(false);
    }
  }

  async function handleCart(productId, quantity = 1) {
    setLoading(true);
    try {
      const res = await addtoCart(productId, quantity);
      return res;
    } finally {
      setLoading(false);
    }
  }

  async function handleCartUpdate(productId, quantity) {
    setLoading(true);
    try {
      const res = await Cartupdate(productId, quantity);
      return res;
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteItem(productId) {
    setLoading(true);
    try {
      const res = await deleteItem(productId);
      return res;
    } finally {
      setLoading(false);
    }
  }

  async function handleClearCart() {
    setLoading(true);
    try {
      const res = await clearCartApi();
      return res;
    } finally {
      setLoading(false);
    }
  }

  async function handleWish(productId) {
    return await toogleWishlist(productId);
  }

  async function handleDeleteWish(productId) {
    return await deleteWishItem(productId);
  }

  async function handleCreate(data) {
    setLoading(true);
    try {
      const res = await create(data);
      return res;
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteProduct(productId) {
    setLoading(true);
    try {
      const res = await deleteProduct(productId);
      return res;
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateOrder(orderData) {
    setLoading(true);
    try {
      const res = await createOrder(orderData);
      return res;
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    handleLogin,
    handleSignup,
    handleLogout,
    handleCart,
    handleCartUpdate,
    handleDeleteItem,
    handleClearCart,
    handleWish,
    handleDeleteWish,
    handleCreate,
    handleDeleteProduct,
    handleCreateOrder,
  };
}