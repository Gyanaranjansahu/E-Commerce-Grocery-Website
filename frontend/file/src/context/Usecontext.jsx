import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { 
  getuser, 
  getItems, 
  getWishList, 
  getAdmin, 
  logout, 
  Login, 
  addtoCart, 
  Cartupdate, 
  deleteItem, 
  Getcart,
  toogleWishlist
} from "../services/api.js";

export const GlobalContext = createContext();

export function Global({ children }) {
  // 1. Admin state
  const [adminData, setAdminData] = useState(null);
  const [adminRefresh, setAdminRefresh] = useState(false);

  // 2. User state
  const [user, setUser] = useState(null);
  const [refresh, setRefresh] = useState(true);

  // 3. Product state
  const [product, setProduct] = useState([]);
  const [productLoading, setProductLoading] = useState(false);

  // 4. Wishlist state
  const [wishdata, setWishdata] = useState([]);
  const [loadWish, setLoadwish] = useState(false);

  // 5. Cart state
  const [cart, setCart] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [total, setTotal] = useState(0);

  // Flexible ID resolver for products & cart items
  const getItemId = (item) => {
    if (!item) return null;
    return item.productId?._id || item.productId || item._id || item.id;
  };

  // Fetch Cart (for authenticated users)
  const fetchCart = useCallback(async () => {
    try {
      setCartLoading(true);
      const res = await Getcart();
      const products = res?.data?.products || res?.cart?.products || (Array.isArray(res?.data) ? res.data : []);
      setCart(products);
      setTotal(products.length);
      return products;
    } catch (error) {
      setCart([]);
      setTotal(0);
      return [];
    } finally {
      setCartLoading(false);
    }
  }, []);

  // Fetch Admin Details (only if admin)
  const admins = useCallback(async () => {
    try {
      setAdminRefresh(true);
      const data = await getAdmin();
      setAdminData(data);
      return data;
    } catch (error) {
      setAdminData(null);
      return null;
    } finally {
      setAdminRefresh(false);
    }
  }, []);

  // Check Current Authenticated User
  const curr_user = useCallback(async () => {
    try {
      setRefresh(true);
      const data = await getuser();
      const currentUser = data?.user || (data?.email ? data : null);

      if (currentUser) {
        setUser(currentUser);
        // Automatically fetch cart & wishlist for authenticated session
        fetchCart();
        getWishlist();
        if (currentUser.role === "admin") {
          admins();
        }
        return currentUser;
      } else {
        setUser(null);
        setCart([]);
        setTotal(0);
        return null;
      }
    } catch (error) {
      setUser(null);
      setCart([]);
      setTotal(0);
      return null;
    } finally {
      setRefresh(false);
    }
  }, [fetchCart, admins]);

  // Fetch Public Products
  const fetchProducts = useCallback(async () => {
    try {
      setProductLoading(true);
      const res = await getItems();
      const products = res?.data || (Array.isArray(res) ? res : []);
      setProduct(products);
      return products;
    } catch (error) {
      setProduct([]);
      return [];
    } finally {
      setProductLoading(false);
    }
  }, []);

  // Wishlist Operations
  const getWishlist = useCallback(async () => {
    try {
      setLoadwish(true);
      const res = await getWishList();
      const wish = res?.wish || res?.data || [];
      setWishdata(wish);
      return wish;
    } catch (error) {
      setWishdata([]);
      return [];
    } finally {
      setLoadwish(false);
    }
  }, []);

  // Centralized Simple Login Action
  const loginUser = async (credentials) => {
    const res = await Login(credentials);
    const loggedInUser = await curr_user();
    return { res, user: loggedInUser };
  };

  // Centralized Simple Logout Action
  const handleUserLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error?.message || error);
    } finally {
      setUser(null);
      setCart([]);
      setTotal(0);
      setAdminData(null);
    }
  };

  // ========================================================
  // Flexible Cart Handlers (Unified Optimistic Updates)
  // ========================================================
  const addToCart = async (productItem, quantity = 1) => {
    const productId = getItemId(productItem);
    if (!productId) return;

    const previousCart = [...cart];

    // Optimistic UI update
    setCart((prev) => {
      const items = Array.isArray(prev) ? prev : [];
      const exists = items.find((item) => getItemId(item) === productId);

      if (exists) {
        return items.map((item) =>
          getItemId(item) === productId
            ? { ...item, quantity: (item.quantity || 1) + quantity }
            : item
        );
      }
      return [...items, { productId: productItem, quantity }];
    });
    setTotal((prev) => prev + 1);

    try {
      await addtoCart(productId);
    } catch (err) {
      // Rollback on error
      setCart(previousCart);
      setTotal(previousCart.length);
      throw err;
    }
  };

  const updateCartQuantity = async (productId, nextQuantity) => {
    const previousCart = [...cart];

    if (nextQuantity <= 0) {
      return removeFromCart(productId);
    }

    // Optimistic update
    setCart((prev) => {
      const items = Array.isArray(prev) ? prev : [];
      return items.map((item) =>
        getItemId(item) === productId ? { ...item, quantity: nextQuantity } : item
      );
    });

    try {
      await Cartupdate(productId, nextQuantity);
    } catch (err) {
      setCart(previousCart);
      throw err;
    }
  };

  const removeFromCart = async (productId) => {
    const previousCart = [...cart];

    // Optimistic removal
    setCart((prev) => {
      const items = Array.isArray(prev) ? prev : [];
      const updated = items.filter((item) => getItemId(item) !== productId);
      setTotal(updated.length);
      return updated;
    });

    try {
      await deleteItem(productId);
    } catch (err) {
      setCart(previousCart);
      setTotal(previousCart.length);
      throw err;
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await toogleWishlist(productId);
      await getWishlist();
    } catch (err) {
      console.error("Wishlist remove error:", err);
    }
  };

  // Initial Load: check session and load catalog
  useEffect(() => {
    curr_user();
    fetchProducts();
  }, [curr_user, fetchProducts]);

  return (
    <GlobalContext.Provider
      value={{
        // Auth state & actions
        user,
        setUser,
        refresh,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin" || adminData?.admin?.role === "admin",
        curr_user,
        loginUser,
        handleUserLogout,

        // Admin state
        adminData,
        setAdminData,
        adminRefresh,
        admins,

        // Product state
        product,
        setProduct,
        productLoading,
        fetchProducts,

        // Cart state & simplified actions
        cart,
        setCart,
        cartLoading,
        total,
        setTotal,
        fetchCart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        getItemId,

        // Wishlist
        wishdata,
        loadWish,
        getWishlist,
        removeFromWishlist,
        toggleWishlist: removeFromWishlist,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

// Custom hook for flexible and simple component consumption
export const useApp = () => useContext(GlobalContext);
export default Global;