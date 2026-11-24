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
MainRouter.get("/getItem",Authmiddleware,HandleController.viewProduct)
MainRouter.delete("/removeItem",Authmiddleware,HandleController.removeFromCart)
MainRouter.post("/addtoCart",Authmiddleware,HandleController.AddtoCart)
MainRouter.get("/cartItem",Authmiddleware,HandleController.viewCart)
MainRouter.post("/wishlist",Authmiddleware,HandleController.WishList)
MainRouter.get("wishItem",Authmiddleware,HandleController.getWish)
MainRouter.put("/updateCart",Authmiddleware,HandleController.updateCart)
export default MainRouter
