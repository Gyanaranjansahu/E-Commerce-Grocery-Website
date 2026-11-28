import express from "express"
import HandleController from "../controller/controller.js"
import Authmiddleware from "../middleware/Authmiddleware.js"
import upload from "../middleware/multer.js"
import verifyAdmin from "../middleware/Adminmiddleware.js"
const MainRouter=express.Router()
MainRouter.post("/register" ,upload.single("profileImage"),HandleController.Register)
MainRouter.post("/login",HandleController.Login)
MainRouter.post("/logout",HandleController.Logout)
MainRouter.get("/logout",HandleController.Logout)
MainRouter.post("/generateOtp",HandleController.GenerateOtp)
MainRouter.post("/verify",HandleController.VerifyOtp)
MainRouter.post("/verifyOtp",HandleController.VerifyOtp)
MainRouter.get("/getuser",Authmiddleware,HandleController.GetUser)
// admin middleware
MainRouter.post("/adminLogin",HandleController.Login)
MainRouter.post("/refresh",HandleController.Refresh)
MainRouter.post("/forgetPassword",HandleController.GenerateOtp)
MainRouter.patch("/changePassword",HandleController.changePassword)
MainRouter.post("/changePassword",HandleController.changePassword)
MainRouter.get("/admin_details",Authmiddleware,verifyAdmin,HandleController.getAdmin)
MainRouter.post("/createProduct",Authmiddleware,verifyAdmin,HandleController.createProduct)
MainRouter.get("/getItem",HandleController.viewProduct)
MainRouter.get("/product",HandleController.viewProduct)
MainRouter.get("/products",HandleController.viewProduct)
MainRouter.delete("/removeItem",Authmiddleware,HandleController.removeFromCart)
MainRouter.post("/addtoCart",Authmiddleware,HandleController.AddtoCart)
MainRouter.get("/cartItem",Authmiddleware,HandleController.viewCart)
MainRouter.post("/wishlist",Authmiddleware,HandleController.WishList)
MainRouter.get("/wishItem",Authmiddleware,HandleController.getWish)
MainRouter.put("/updateCart",Authmiddleware,HandleController.updateCart)

// Payments, Orders & Admin Management
MainRouter.post("/payment/create-order", Authmiddleware, HandleController.createPaymentOrder)
MainRouter.post("/payment/verify", Authmiddleware, HandleController.verifyPayment)
MainRouter.get("/myOrders", Authmiddleware, HandleController.getMyOrders)
MainRouter.get("/admin/orders", Authmiddleware, verifyAdmin, HandleController.getAllOrders)
MainRouter.put("/admin/orderStatus", Authmiddleware, verifyAdmin, HandleController.updateOrderStatus)
MainRouter.get("/admin/users", Authmiddleware, verifyAdmin, HandleController.getAllUsers)
MainRouter.delete("/admin/deleteProduct", Authmiddleware, verifyAdmin, HandleController.deleteProduct)
export default MainRouter
