import { createContext, useEffect, useState, useCallback } from "react";
import {
  getuser,
  getItems,
  getWishList,
  getAdmin,
  Getcart,
  logoutUser,
  deleteWishItem,
} from "../services/api.js";

export const GlobalContext = createContext();

export function Global({ children }) {
  // Admin State
  const [adminData, setAdminData] = useState(null);
  const [adminRefresh, setAdminRefresh] = useState(true);

  // User Auth State
  const [user, setUser] = useState(null);
  const [refresh, setRefresh] = useState(true);

  // Products State
  const [product, setProduct] = useState([]);
  const [productLoading, setProductLoading] = useState(false);

  // Wishlist State
  const [wishdata, setWishdata] = useState([]);
  const [loadWish, setLoadWish] = useState(false);

  // Cart State
  const [cart, setCart] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [total, setTotal] = useState(0);

  // 1. Fetch Current User
  const curr_user = useCallback(async () => {
    try {
      setRefresh(true);
      const data = await getuser();
      setUser(data?.user || (data?._id ? data : null));
      return data?.user || null;
    } catch {
      setUser(null);
      return null;
    } finally {
      setRefresh(false);
    }
  }, []);

  // 2. Fetch Admin Details
  const admins = useCallback(async () => {
    try {
      setAdminRefresh(true);
      const data = await getAdmin();
      const resolvedAdmin = data?.admin || (data?.role === "admin" ? data : null);
      setAdminData(resolvedAdmin);
      return resolvedAdmin;
    } catch {
      setAdminData(null);
      return null;
    } finally {
      setAdminRefresh(false);
    }
  }, []);

  // 3. Fetch Products Catalog (Public)
  const fetchProducts = useCallback(async () => {
    try {
      setProductLoading(true);
      const res = await getItems();
      const list = res?.data || res?.items || (Array.isArray(res) ? res : []);
      setProduct(list);
      return list;
    } catch {
      setProduct([]);
      return [];
    } finally {
      setProductLoading(false);
    }
  }, []);

  // 4. Fetch Cart
  const fetchCart = useCallback(async () => {
    try {
      setCartLoading(true);
      const res = await Getcart();
      const rawProducts = res?.data?.products || (Array.isArray(res?.data) ? res.data : []);
      // Filter out any invalid/deleted product entries
      const validProducts = rawProducts.filter(
        (item) => item.productId != null
      );
      setCart(validProducts);
      setTotal(validProducts.length);
      return validProducts;
    } catch {
      setCart([]);
      setTotal(0);
      return [];
    } finally {
      setCartLoading(false);
    }
  }, []);

  // 5. Fetch Wishlist
  const getWishlist = useCallback(async () => {
    try {
      setLoadWish(true);
      const res = await getWishList();
      const list =
        res?.wish?.products ||
        (Array.isArray(res?.wish) ? res.wish : []) ||
        res?.data ||
        [];
      // Keep only valid product entries
      const validItems = list.filter((item) => {
        const prod = item.productId || item;
        return prod && (prod._id || prod.name);
      });
      setWishdata(validItems);
      return validItems;
    } catch {
      setWishdata([]);
      return [];
    } finally {
      setLoadWish(false);
    }
  }, []);

  // 6. Remove from Wishlist helper
  const removeFromWishlist = async (productId) => {
    try {
      await deleteWishItem(productId);
      setWishdata((prev) =>
        prev.filter((item) => {
          const id = item.productId?._id || item.productId || item._id;
          return String(id) !== String(productId);
        })
      );
    } catch (err) {
      console.error("Failed to remove from wishlist:", err);
    }
  };

  // 7. Full Logout
  const handleUserLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.warn("Logout request failed:", err);
    } finally {
      setUser(null);
      setAdminData(null);
      setCart([]);
      setWishdata([]);
      setTotal(0);
    }
  };

  // Run on initial mount
  useEffect(() => {
    curr_user();
    admins();
    fetchProducts();
    fetchCart();
    getWishlist();
  }, [curr_user, admins, fetchProducts, fetchCart, getWishlist]);

  return (
    <GlobalContext.Provider
      value={{
        // Admin
        adminData,
        setAdminData,
        adminRefresh,
        admins,

        // User
        user,
        setUser,
        refresh,
        curr_user,
        handleUserLogout,

        // Catalog
        product,
        setProduct,
        productLoading,
        fetchProducts,

        // Cart
        cart,
        setCart,
        cartLoading,
        fetchCart,
        total,
        setTotal,

        // Wishlist
        wishdata,
        setWishdata,
        loadWish,
        getWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}