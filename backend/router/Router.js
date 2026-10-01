import express from "express";
import HandleController from "../controller/controller.js";
import Authmiddleware from "../middleware/Authmiddleware.js";
import upload from "../middleware/multer.js";
import verifyAdmin from "../middleware/Adminmiddleware.js";

const MainRouter = express.Router();

// ==========================================
// AUTHENTICATION
// ==========================================
MainRouter.post("/register", upload.single("profileImage"), HandleController.Register);
MainRouter.post("/login", HandleController.Login);
MainRouter.post("/logout", Authmiddleware, HandleController.logout);
MainRouter.get("/getuser", Authmiddleware, HandleController.GetUser);
MainRouter.post("/generateOtp", HandleController.GenerateOtp);
MainRouter.post("/verify", HandleController.VerifyOtp);

// ==========================================
// ADMIN AUTH & MANAGEMENT
// ==========================================
MainRouter.post("/adminLogin", HandleController.Login);
MainRouter.get("/admin_details", Authmiddleware, verifyAdmin, HandleController.getAdmin);
MainRouter.get("/admin/users", Authmiddleware, verifyAdmin, HandleController.getAllUsers);

// ==========================================
// PRODUCTS (Public Catalog & Admin Management)
// ==========================================
MainRouter.get("/getItem", HandleController.viewProduct);
MainRouter.get("/product/:id", HandleController.getProductById);
MainRouter.post("/createProduct", upload.single("image"), Authmiddleware, verifyAdmin, HandleController.createProduct);
MainRouter.put("/updateProduct/:id", upload.single("image"), Authmiddleware, verifyAdmin, HandleController.updateProduct);
MainRouter.delete("/deleteProduct/:id", Authmiddleware, verifyAdmin, HandleController.deleteProduct);

// ==========================================
// CART
// ==========================================
MainRouter.post("/addtoCart", Authmiddleware, HandleController.AddtoCart);
MainRouter.get("/cartItem", Authmiddleware, HandleController.viewCart);
MainRouter.put("/updateCart", Authmiddleware, HandleController.updateCart);
MainRouter.delete("/removeItem", Authmiddleware, HandleController.removeFromCart);
MainRouter.delete("/clearCart", Authmiddleware, HandleController.clearCart);

// ==========================================
// WISHLIST
// ==========================================
MainRouter.post("/wishlist", Authmiddleware, HandleController.WishList);
MainRouter.get("/wishItem", Authmiddleware, HandleController.getWish);
MainRouter.delete("/wishlist", Authmiddleware, HandleController.deleteWish);

// ==========================================
// ORDERS
// ==========================================
MainRouter.post("/order", Authmiddleware, HandleController.createOrder);
MainRouter.get("/myOrders", Authmiddleware, HandleController.getMyOrders);
MainRouter.get("/admin/orders", Authmiddleware, verifyAdmin, HandleController.getAllOrders);
MainRouter.put("/order/status/:orderId", Authmiddleware, verifyAdmin, HandleController.updateOrderStatus);
MainRouter.put("/order/ship/:orderId", Authmiddleware, verifyAdmin, HandleController.shipOrder);

export default MainRouter;
