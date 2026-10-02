import axios from "axios";
import { toast } from "sonner";

export const api = axios.create({
  baseURL: "https://e-commerce-grocery-website-6wyf.onrender.com",
  withCredentials: true,
});

// Helper to extract clean error message from backend responses
export const getErrorMessage = (err, fallback = "Something went wrong") => {
  return (
    err.response?.data?.message ||
    err.response?.data?.error ||
    err.message ||
    fallback
  );
};

// ==========================================
// AUTHENTICATION
// ==========================================
export async function signup(data) {
  const {
    name,
    email,
    password,
    phone,
    number,
    profileImage,
    flat,
    landmark,
    area,
    city,
    pin,
  } = data;

  try {
    const form = new FormData();
    form.append("name", name || "");
    form.append("email", email || "");
    form.append("password", password || "");
    form.append("phone", phone || number || "");
    form.append("flat", flat || "");
    form.append("landmark", landmark || area || "");
    form.append("city", city || "");
    form.append("pin", pin || "");

    if (profileImage instanceof File || profileImage instanceof Blob) {
      form.append("profileImage", profileImage);
    }

    const response = await api.post("/register", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    toast.success(response.data?.message || "Account registered successfully!");
    return response.data;
  } catch (err) {
    const errorMsg = getErrorMessage(err, "Registration failed");
    toast.error(errorMsg);
    throw new Error(errorMsg);
  }
}

export async function Login({ email, password }) {
  try {
    const response = await api.post("/login", { email, password });
    toast.success(response.data?.message || "Logged in successfully!");
    return response.data;
  } catch (err) {
    const errorMsg = getErrorMessage(err, "Login failed");
    toast.error(errorMsg);
    throw new Error(errorMsg);
  }
}

export async function logoutUser() {
  try {
    const response = await api.post("/logout");
    toast.success(response.data?.message || "Signed out successfully");
    return response.data;
  } catch (err) {
    const errorMsg = getErrorMessage(err, "Logout failed");
    toast.error(errorMsg);
    throw new Error(errorMsg);
  }
}

export async function getuser() {
  try {
    const response = await api.get("/getuser");
    return response.data;
  } catch {
    return null;
  }
}

// ==========================================
// CATALOG
// ==========================================
export async function getItems() {
  try {
    const response = await api.get("/getItem");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch catalog:", error);
    return { data: [] };
  }
}

export async function getProductById(id) {
  try {
    const response = await api.get(`/product/${id}`);
    return response.data;
  } catch (error) {
    const errorMsg = getErrorMessage(error, "Failed to fetch product");
    toast.error(errorMsg);
    throw new Error(errorMsg);
  }
}

// ==========================================
// CART
// ==========================================
export async function addtoCart(productId, quantity = 1) {
  try {
    const response = await api.post("/addtoCart", { productId, quantity });
    toast.success(response?.data?.message || "Item added to cart!");
    return response.data;
  } catch (error) {
    const errorMsg = getErrorMessage(error, "Failed to add item to cart");
    toast.error(errorMsg);
    throw new Error(errorMsg);
  }
}

export async function Getcart() {
  try {
    const response = await api.get("/cartItem");
    return response.data;
  } catch {
    return { data: { products: [] } };
  }
}

export async function Cartupdate(productId, quantity) {
  try {
    const response = await api.put("/updateCart", { productId, quantity });
    return response.data;
  } catch (error) {
    const errorMsg = getErrorMessage(error, "Failed to update cart");
    toast.error(errorMsg);
    throw new Error(errorMsg);
  }
}

export async function deleteItem(productId) {
  try {
    const response = await api.delete("/removeItem", { data: { productId } });
    toast.info(response?.data?.message || "Item removed from cart");
    return response.data;
  } catch (error) {
    const errorMsg = getErrorMessage(error, "Failed to remove item");
    toast.error(errorMsg);
    throw new Error(errorMsg);
  }
}

export async function clearCartApi() {
  try {
    const response = await api.delete("/clearCart");
    return response.data;
  } catch (error) {
    console.error("Failed to clear cart:", error);
  }
}

// ==========================================
// WISHLIST
// ==========================================
export async function toogleWishlist(productId) {
  try {
    const response = await api.post("/wishlist", { productId });
    toast.success(response?.data?.message || "Wishlist updated");
    return response.data;
  } catch (error) {
    const errorMsg = getErrorMessage(error, "Failed to update wishlist");
    toast.error(errorMsg);
    throw new Error(errorMsg);
  }
}

export const getWishList = async () => {
  try {
    const response = await api.get("/wishItem");
    return response.data;
  } catch {
    return { wish: { products: [] } };
  }
};

export const deleteWishItem = async (productId) => {
  try {
    const response = await api.delete("/wishlist", { data: { productId } });
    toast.info("Removed from wishlist");
    return response.data;
  } catch (error) {
    const errorMsg = getErrorMessage(error, "Failed to remove from wishlist");
    toast.error(errorMsg);
    throw new Error(errorMsg);
  }
};

// ==========================================
// ORDERS
// ==========================================
export async function createOrder(orderData) {
  try {
    const response = await api.post("/order", orderData);
    toast.success(response.data?.message || "Order placed successfully!");
    return response.data;
  } catch (error) {
    const errorMsg = getErrorMessage(error, "Failed to place order");
    toast.error(errorMsg);
    throw new Error(errorMsg);
  }
}

export async function getMyOrders() {
  try {
    const response = await api.get("/myOrders");
    return response.data;
  } catch (error) {
    const errorMsg = getErrorMessage(error, "Failed to fetch orders");
    console.error(errorMsg);
    return { orders: [] };
  }
}

export async function getAllOrders() {
  try {
    const response = await api.get("/admin/orders");
    return response.data;
  } catch (error) {
    const errorMsg = getErrorMessage(error, "Failed to fetch orders");
    console.error(errorMsg);
    return { orders: [] };
  }
}

export async function updateOrderStatus(orderId, status) {
  try {
    const response = await api.put(`/order/status/${orderId}`, { status });
    toast.success(response.data?.message || `Order status updated to ${status}`);
    return response.data;
  } catch (error) {
    const errorMsg = getErrorMessage(error, "Failed to update order status");
    toast.error(errorMsg);
    throw new Error(errorMsg);
  }
}

// ==========================================
// ADMIN MANAGEMENT
// ==========================================
export async function getAdmin() {
  try {
    const response = await api.get("/admin_details");
    return response.data;
  } catch {
    return null;
  }
}

export async function getAllUsers() {
  try {
    const response = await api.get("/admin/users");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return { users: [] };
  }
}

export async function create(productData) {
  const form = new FormData();
  form.append("name", productData.name || "");
  form.append("description", productData.description || "");
  form.append("price", productData.price || "");
  form.append("quantity", productData.quantity || "");
  form.append("category", productData.category || "");

  if (productData.image instanceof File || productData.image instanceof Blob) {
    form.append("image", productData.image);
  }

  try {
    const response = await api.post("/createProduct", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    toast.success(response.data?.message || "Product created successfully!");
    return response.data;
  } catch (error) {
    const errorMsg = getErrorMessage(error, "Failed to create product");
    toast.error(errorMsg);
    throw new Error(errorMsg);
  }
}

export async function deleteProduct(productId) {
  try {
    const response = await api.delete(`/deleteProduct/${productId}`);
    toast.success(response.data?.message || "Product deleted successfully!");
    return response.data;
  } catch (error) {
    const errorMsg = getErrorMessage(error, "Failed to delete product");
    toast.error(errorMsg);
    throw new Error(errorMsg);
  }
}

export async function updateProduct(productId, productData) {
  const form = new FormData();
  if (productData.name) form.append("name", productData.name);
  if (productData.description) form.append("description", productData.description);
  if (productData.price) form.append("price", productData.price);
  if (productData.quantity) form.append("quantity", productData.quantity);
  if (productData.category) form.append("category", productData.category);
  if (productData.image instanceof File || productData.image instanceof Blob) {
    form.append("image", productData.image);
  }

  try {
    const response = await api.put(`/updateProduct/${productId}`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    toast.success(response.data?.message || "Product updated successfully!");
    return response.data;
  } catch (error) {
    const errorMsg = getErrorMessage(error, "Failed to update product");
    toast.error(errorMsg);
    throw new Error(errorMsg);
  }
}

export default api;