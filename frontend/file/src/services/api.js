import axios from "axios";

// =========================================================================
// APPROACH & ARCHITECTURE:
// 1. Axios instance configured with `withCredentials: true` so the browser 
//    automatically attaches HTTP-only cookies (`Access_token` and `Refresh_token`).
// 2. Simple 401 Response Interceptor: When an access token expires (15 mins), 
//    the backend returns 401. The interceptor intercepts this, calls `POST /refresh`
//    once, and retries the failed request seamlessly.
// 3. Clear, simple async functions that return the response payload or throw a readable error.
// =========================================================================

// Dynamically resolve API URL: uses VITE_API_URL env variable if present,
// otherwise defaults to the deployed Vercel backend.
const API_BASE_URL = 
  import.meta.env.VITE_API_URL || 
  "https://e-commerce-grocery-website-5m9l.vercel.app";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Simple interceptor to automatically renew access token when expired
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 Unauthorized and not already retried
    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      !originalRequest?.url?.includes("/login") &&
      !originalRequest?.url?.includes("/register") &&
      !originalRequest?.url?.includes("/refresh")
    ) {
      originalRequest._retry = true;

      try {
        // Attempt to generate a new Access_token using the Refresh_token cookie
        await api.post("/api/v1/refresh");
        // Retry the original request with the updated cookie
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token is also expired or invalid -> reject cleanly
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Helper to extract clean error message
const getErrorMessage = (err, fallback) => {
  return err.response?.data?.message || err.response?.data?.error || err.message || fallback;
};

// =========================================================================
// AUTHENTICATION APIs
// =========================================================================

// 1. Register User (multipart/form-data for profile picture)
export async function signup(data) {
  try {
    const { name, email, password, phone, number, profileImage, flat, landmark, area, city, pin } = data;
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

    const response = await api.post("/api/v1/register", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (err) {
    throw new Error(getErrorMessage(err, "Registration failed"));
  }
}

// 2. Login User (receives Access_token & Refresh_token cookies)
export async function Login(credentials, maybePassword) {
  try {
    const payload = typeof credentials === "object" && credentials !== null
      ? credentials
      : { email: credentials, password: maybePassword };
    const response = await api.post("/api/v1/login", payload);
    return response.data;
  } catch (err) {
    throw new Error(getErrorMessage(err, "Login failed"));
  }
}

// 3. Get Authenticated User Details
export async function getuser() {
  try {
    const response = await api.get("/api/v1/getuser");
    return response.data;
  } catch (err) {
    throw new Error(getErrorMessage(err, "Failed to fetch user"));
  }
}

// 4. Refresh Access Token explicitly if needed
export async function refreshToken() {
  try {
    const response = await api.post("/api/v1/refresh");
    return response.data;
  } catch (err) {
    throw new Error(getErrorMessage(err, "Session expired. Please log in again."));
  }
}

// 5. Logout User (clears backend authentication cookies)
export async function logout() {
  try {
    const response = await api.post("/api/v1/logout");
    return response.data;
  } catch (err) {
    throw new Error(getErrorMessage(err, "Logout failed"));
  }
}

// =========================================================================
// OTP & PASSWORD RESET APIs
// =========================================================================

// 6. Send OTP to registered email
export async function sendOtp(emailOrPayload) {
  try {
    const payload = typeof emailOrPayload === "object" && emailOrPayload !== null
      ? emailOrPayload
      : { email: emailOrPayload };
    const response = await api.post("/api/v1/forgetPassword", payload);
    return response.data;
  } catch (err) {
    throw new Error(getErrorMessage(err, "Failed to send OTP code"));
  }
}

// 7. Verify 6-digit OTP code
export async function verifyOtp(emailOrPayload, maybeOtp) {
  try {
    const payload = typeof emailOrPayload === "object" && emailOrPayload !== null
      ? emailOrPayload
      : { email: emailOrPayload, otp: maybeOtp };
    const response = await api.post("/api/v1/verify", payload);
    return response.data;
  } catch (err) {
    throw new Error(getErrorMessage(err, "Invalid or expired OTP"));
  }
}

// 8. Update Password (after OTP verification or direct reset)
export async function changePassword(emailOrPayload, maybePassword) {
  try {
    const payload = typeof emailOrPayload === "object" && emailOrPayload !== null
      ? emailOrPayload
      : { email: emailOrPayload, newPassword: maybePassword };
    const response = await api.patch("/api/v1/changePassword", payload);
    return response.data;
  } catch (err) {
    throw new Error(getErrorMessage(err, "Failed to update password"));
  }
}

// =========================================================================
// PRODUCTS, CART & WISHLIST APIs
// =========================================================================

// 9. Fetch all products
export async function getItems() {
  try {
    const response = await api.get("/api/v1/getItem");
    return response.data;
  } catch (err) {
    throw new Error(getErrorMessage(err, "Failed to fetch products"));
  }
}

// 10. Add item to cart
export async function addtoCart(productId) {
  try {
    const response = await api.post("/api/v1/addtoCart", { productId });
    return response.data;
  } catch (err) {
    throw new Error(getErrorMessage(err, "Failed to add item to cart"));
  }
}

// 11. View cart items
export async function Getcart() {
  try {
    const response = await api.get("/api/v1/cartItem");
    return response.data;
  } catch (err) {
    throw new Error(getErrorMessage(err, "Failed to load cart"));
  }
}

// 12. Update quantity in cart
export async function Cartupdate(productId, quantity) {
  try {
    const response = await api.put("/api/v1/updateCart", { productId, quantity });
    return response.data;
  } catch (err) {
    throw new Error(getErrorMessage(err, "Failed to update cart quantity"));
  }
}

// 13. Remove item from cart
export async function deleteItem(productId) {
  try {
    const response = await api.delete("/api/v1/removeItem", { data: { productId } });
    return response.data;
  } catch (err) {
    throw new Error(getErrorMessage(err, "Failed to remove item from cart"));
  }
}

// 14. Toggle item in wishlist
export async function toogleWishlist(itemId) {
  try {
    const response = await api.post("/api/v1/wishlist", { productId: itemId });
    return response.data;
  } catch (err) {
    throw new Error(getErrorMessage(err, "Failed to update wishlist"));
  }
}

// 15. Fetch user wishlist
export async function getWishList() {
  try {
    const response = await api.get("/api/v1/wishItem");
    return response.data;
  } catch (err) {
    throw new Error(getErrorMessage(err, "Failed to fetch wishlist"));
  }
}

// 16. Admin create product
export async function create(productData) {
  try {
    const form = new FormData();
    form.append("name", productData.name || "");
    form.append("description", productData.description || "");
    form.append("price", productData.price || "");
    form.append("quantity", productData.quantity || "");
    form.append("category", productData.category || "");

    if (productData.image instanceof File || productData.image instanceof Blob) {
      form.append("image", productData.image);
    }

    const response = await api.post("/api/v1/createProduct", form);
    return response.data;
  } catch (err) {
    throw new Error(getErrorMessage(err, "Failed to create product"));
  }
}

// 17. Get Admin Details
export async function getAdmin() {
  try {
    const response = await api.get("/api/v1/admin_details");
    return response.data;
  } catch (err) {
    throw new Error(getErrorMessage(err, "Failed to verify admin"));
  }
}

// 18. Orders: Place new order
export async function createOrder(orderData) {
  try {
    const response = await api.post("/api/v1/order", orderData);
    return response.data;
  } catch (err) {
    throw new Error(getErrorMessage(err, "Failed to place order"));
  }
}

// 19. Orders: Get authenticated user's orders
export async function getMyOrders() {
  try {
    const response = await api.get("/api/v1/myOrders");
    return response.data;
  } catch (err) {
    throw new Error(getErrorMessage(err, "Failed to load orders"));
  }
}

// 20. Admin: Get all customer orders
export async function getAllOrders() {
  try {
    const response = await api.get("/api/v1/admin/orders");
    return response.data;
  } catch (err) {
    throw new Error(getErrorMessage(err, "Failed to fetch all orders"));
  }
}

// 21. Admin: Update status of an order
export async function updateOrderStatus(orderId, orderStatus) {
  try {
    const response = await api.put("/api/v1/admin/orderStatus", { orderId, orderStatus });
    return response.data;
  } catch (err) {
    throw new Error(getErrorMessage(err, "Failed to update order status"));
  }
}

// 22. Admin: Get all registered customers
export async function getAllUsers() {
  try {
    const response = await api.get("/api/v1/admin/users");
    return response.data;
  } catch (err) {
    throw new Error(getErrorMessage(err, "Failed to fetch users"));
  }
}

// 23. Admin: Delete product
export async function deleteProduct(productId) {
  try {
    const response = await api.delete("/api/v1/admin/deleteProduct", { data: { productId } });
    return response.data;
  } catch (err) {
    throw new Error(getErrorMessage(err, "Failed to delete product"));
  }
}

export default api;
