import UserModel from "../model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import CartModel from "../model/cartSchema.js";
import uploadToCloud from "../config/uploadtocloud.js";
import fs from "fs";
import ProductModel from "../model/product.js";
import wishlistModel from "../model/wishlistModel.js";
import listed from "../model/Blacklist.js";
import Order from "../model/orderSchema.js";
import OtpModel from "../model/OtpModel.js";
import sendEmail from "../config/mail.js";

const JWT_SECRET = process.env.JWT_SECRET || "hifdub.089hjkfmol";

class HandleController {
  // ==========================================
  // AUTH: REGISTER
  // ==========================================
  static Register = async (req, res, next) => {
    try {
      let { name, email, password, phone, landmark, area, pin, flat, city } = req.body;
      const finalLandmark = landmark || area;

      if (!name || !email || !password || !phone || !finalLandmark || !pin || !flat || !city) {
        return res.status(400).json({ message: "All fields are required" });
      }

      let user = await UserModel.findOne({ email: email.toLowerCase().trim() });
      if (user) {
        return res.status(400).json({ message: "User already exists with this email" });
      }

      // Handle profile photo upload or default avatar
      let imgurl = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
      if (req.file) {
        const profileImagePath = req.file.path;
        try {
          imgurl = await uploadToCloud(profileImagePath, "profile");
        } catch (uploadErr) {
          console.warn("Cloudinary upload failed, using default avatar:", uploadErr.message);
        } finally {
          try {
            if (fs.existsSync(profileImagePath)) {
              fs.unlinkSync(profileImagePath);
            }
          } catch (cleanupErr) {
            console.warn("Failed to delete temp file:", cleanupErr.message);
          }
        }
      }

      // Check admin seed from env
      const admin = await UserModel.findOne({ role: "admin" });
      if (!admin && process.env.ADMIN_EMAIL) {
        const adminPass = process.env.ADMIN_PASSWORD || "admin123";
        let hashedAdminPassword = await bcrypt.hash(adminPass, 10);
        let Admin = new UserModel({
          name: "Admin",
          email: process.env.ADMIN_EMAIL.toLowerCase().trim(),
          password: hashedAdminPassword,
          profileImage: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
          phone: "+917846813554",
          role: "admin",
          flat: "HQ",
          landmark: "HQ",
          city: "HQ",
          pin: "000000",
        });
        await Admin.save();
      }

      const isDefaultAdmin = process.env.ADMIN_EMAIL && email.toLowerCase().trim() === process.env.ADMIN_EMAIL.toLowerCase().trim();
      let hashedPassword = await bcrypt.hash(password, 10);
      let newUser = new UserModel({
        name,
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        profileImage: imgurl,
        phone,
        landmark: finalLandmark,
        pin,
        city,
        flat,
        role: isDefaultAdmin ? "admin" : "user",
      });

      await newUser.save();
      return res.status(201).json({ success: true, message: "User registered successfully" });
    } catch (err) {
      console.error("Register Error:", err);
      next(err);
    }
  };

  // ==========================================
  // AUTH: LOGIN
  // ==========================================
  static Login = async (req, res, next) => {
    try {
      let { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      let user = await UserModel.findOne({ email: email.toLowerCase().trim() });
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      // Auto upgrade admin role if matching admin email
      if (process.env.ADMIN_EMAIL && user.email === process.env.ADMIN_EMAIL.toLowerCase().trim() && user.role !== "admin") {
        user.role = "admin";
        await user.save();
      }

      let isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const generateToken = jwt.sign(
        { email: user.email, _id: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: "7d" }
      );
// const isProduction = process.env.NODE_ENV === "production";
      res.cookie("token", generateToken, {
      httpOnly: true,
      secure: true,       // Required for sameSite: "none"
      sameSite: "none",   // Required for cross-domain (Vercel -> Render)
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

      return res.status(200).json({
        success: true,
        message: "Login successful",
        token: generateToken,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          profileImage: user.profileImage,
          flat: user.flat,
          landmark: user.landmark,
          city: user.city,
          pin: user.pin,
        },
      });
    } catch (err) {
      next(err);
    }
  };

  // ==========================================
  // AUTH: GET CURRENT USER
  // ==========================================
  static GetUser = async (req, res, next) => {
    try {
      const user = await UserModel.findById(req.user._id).select("-password -__v");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json({ success: true, user });
    } catch (err) {
      next(err);
    }
  };

  // ==========================================
  // AUTH: LOGOUT
  // ==========================================
  static logout = async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      const token =
        req.cookies?.token ||
        (authHeader && authHeader.startsWith("Bearer ")
          ? authHeader.split(" ")[1]
          : authHeader);

      if (token) {
        await listed.create({ token });
      }

      res.clearCookie("token", {
        httpOnly: true,
        sameSite: "lax",
      });

      return res.status(200).json({
        success: true,
        message: "Logout successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  // ==========================================
  // ADMIN: DETAILS & METRICS
  // ==========================================
  static getAdmin = async (req, res, next) => {
    try {
      let admin_id = req.user._id;
      let find = await UserModel.findById(admin_id).select("-password");
      if (!find || find.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admin only." });
      }
      return res.status(200).json({
        success: true,
        message: "admin",
        admin: find,
      });
    } catch (error) {
      next(error);
    }
  };

  static getAllUsers = async (req, res, next) => {
    try {
      const users = await UserModel.find().select("-password").sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: users.length,
        users,
      });
    } catch (error) {
      next(error);
    }
  };

  // ==========================================
  // PRODUCTS: PUBLIC VIEW & ADMIN CRUD
  // ==========================================
  static viewProduct = async (req, res, next) => {
    try {
      const products = await ProductModel.find({}).sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: products.length,
        data: products,
        message: "Products fetched successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  static getProductById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const product = await ProductModel.findById(id);
      if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }
      return res.status(200).json({ success: true, product });
    } catch (error) {
      next(error);
    }
  };

  static createProduct = async (req, res, next) => {
    try {
      const { name, description, price, category, quantity } = req.body;

      if (!name || !price || !category) {
        return res.status(400).json({ message: "Name, price, and category are required" });
      }

      let imageLink = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=80";

      if (req.file) {
        const imageUrl = req.file.path;
        try {
          imageLink = await uploadToCloud(imageUrl, "productImage");
        } catch (uploadErr) {
          console.warn("Cloudinary upload failed for product image, using fallback:", uploadErr.message);
        } finally {
          try {
            if (fs.existsSync(imageUrl)) {
              fs.unlinkSync(imageUrl);
            }
          } catch (cleanupErr) {
            console.warn("Failed to delete temp file:", cleanupErr.message);
          }
        }
      }

      const product = await ProductModel.create({
        name,
        description: description || "Fresh farm harvested produce.",
        price: Number(price),
        category,
        quantity: Number(quantity) || 50,
        image: imageLink,
      });

      return res.status(201).json({
        success: true,
        message: "Product added successfully",
        product,
      });
    } catch (error) {
      next(error);
    }
  };

  static updateProduct = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, description, price, category, quantity } = req.body;

      let updateData = {
        ...(name && { name }),
        ...(description && { description }),
        ...(price && { price: Number(price) }),
        ...(category && { category }),
        ...(quantity !== undefined && { quantity: Number(quantity) }),
      };

      if (req.file) {
        const imageUrl = req.file.path;
        try {
          updateData.image = await uploadToCloud(imageUrl, "productImage");
        } finally {
          if (fs.existsSync(imageUrl)) fs.unlinkSync(imageUrl);
        }
      }

      const updated = await ProductModel.findByIdAndUpdate(id, updateData, { new: true });
      if (!updated) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }

      return res.status(200).json({
        success: true,
        message: "Product updated successfully",
        product: updated,
      });
    } catch (error) {
      next(error);
    }
  };

  static deleteProduct = async (req, res, next) => {
    try {
      const { id } = req.params;
      const targetId = id || req.body.productId;

      if (!targetId) {
        return res.status(400).json({ message: "Product ID is required" });
      }

      const deleted = await ProductModel.findByIdAndDelete(targetId);
      if (!deleted) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Cleanup from carts and wishlists
      await CartModel.updateMany({}, { $pull: { products: { productId: targetId } } });
      await wishlistModel.updateMany({}, { $pull: { products: { productId: targetId } } });

      return res.status(200).json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  // ==========================================
  // CART OPERATIONS
  // ==========================================
  static AddtoCart = async (req, res, next) => {
    try {
      const { productId } = req.body;
      const quantity = Number(req.body.quantity) || 1;

      if (!productId) {
        return res.status(400).json({ message: "Product ID is required" });
      }

      const userId = req.user?._id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      let cart = await CartModel.findOne({ userId });

      if (cart) {
        const exist = cart.products.find(
          (p) => String(p.productId?._id || p.productId) === String(productId)
        );

        if (exist) {
          exist.quantity += quantity;
        } else {
          cart.products.push({ productId, quantity });
        }
        await cart.save();
      } else {
        cart = await CartModel.create({
          userId,
          products: [{ productId, quantity }],
        });
      }

      const populatedCart = await CartModel.findOne({ userId }).populate("products.productId");
      return res.status(200).json({
        success: true,
        message: "Product added to cart",
        data: populatedCart,
      });
    } catch (err) {
      next(err);
    }
  };

  static viewCart = async (req, res, next) => {
    try {
      let cart = await CartModel.findOne({ userId: req.user._id }).populate("products.productId");

      if (!cart) {
        return res.status(200).json({
          success: true,
          data: { userId: req.user._id, products: [] },
        });
      }

      // Filter out any dangling items where product was removed from database
      const validProducts = cart.products.filter((item) => item.productId != null);
      if (validProducts.length !== cart.products.length) {
        cart.products = validProducts;
        await cart.save();
      }

      return res.status(200).json({
        success: true,
        data: cart,
      });
    } catch (err) {
      next(err);
    }
  };

  static updateCart = async (req, res, next) => {
    try {
      const { productId, quantity } = req.body;
      if (!productId || quantity === undefined) {
        return res.status(400).json({ message: "Product ID and quantity are required" });
      }

      const cart = await CartModel.findOne({ userId: req.user._id });
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      const exist = cart.products.find(
        (p) => String(p.productId?._id || p.productId) === String(productId)
      );

      if (!exist) {
        return res.status(404).json({ message: "Product not found in cart" });
      }

      if (Number(quantity) <= 0) {
        cart.products = cart.products.filter(
          (p) => String(p.productId?._id || p.productId) !== String(productId)
        );
      } else {
        exist.quantity = Number(quantity);
      }

      await cart.save();
      const populated = await CartModel.findOne({ userId: req.user._id }).populate("products.productId");

      return res.status(200).json({
        success: true,
        message: "Cart updated",
        data: populated,
      });
    } catch (err) {
      next(err);
    }
  };

  static removeFromCart = async (req, res, next) => {
    try {
      const { productId } = req.body;
      if (!productId) {
        return res.status(400).json({ message: "Product id is required" });
      }

      const cart = await CartModel.findOne({ userId: req.user._id });
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      cart.products = cart.products.filter(
        (p) => String(p.productId?._id || p.productId) !== String(productId)
      );

      await cart.save();
      return res.status(200).json({
        success: true,
        message: "Product removed from cart",
        data: cart,
      });
    } catch (err) {
      next(err);
    }
  };

  static clearCart = async (req, res, next) => {
    try {
      const cart = await CartModel.findOne({ userId: req.user._id });
      if (cart) {
        cart.products = [];
        await cart.save();
      }
      return res.status(200).json({ success: true, message: "Cart cleared" });
    } catch (err) {
      next(err);
    }
  };

  // ==========================================
  // WISHLIST OPERATIONS
  // ==========================================
  static WishList = async (req, res, next) => {
    try {
      const { productId } = req.body;
      const userId = req.user._id;

      if (!productId) {
        return res.status(400).json({ success: false, message: "Product ID is required" });
      }

      let wishlist = await wishlistModel.findOne({ userId });

      if (!wishlist) {
        wishlist = await wishlistModel.create({
          userId,
          products: [{ productId }],
        });
        const populated = await wishlistModel.findById(wishlist._id).populate("products.productId");
        return res.status(201).json({
          success: true,
          message: "Added to Wishlist",
          wish: populated,
        });
      }

      const existsIndex = wishlist.products.findIndex(
        (item) => String(item.productId?._id || item.productId) === String(productId)
      );

      let responseMessage = "";
      if (existsIndex > -1) {
        wishlist.products.splice(existsIndex, 1);
        responseMessage = "Removed from Wishlist";
      } else {
        wishlist.products.push({ productId });
        responseMessage = "Added to Wishlist";
      }

      await wishlist.save();
      const populated = await wishlistModel.findOne({ userId }).populate("products.productId");

      return res.status(200).json({
        success: true,
        message: responseMessage,
        wish: populated,
      });
    } catch (error) {
      next(error);
    }
  };

  static getWish = async (req, res, next) => {
    try {
      const userId = req.user._id;
      let wish = await wishlistModel.findOne({ userId }).populate("products.productId");

      if (!wish) {
        return res.status(200).json({
          success: true,
          message: "No wishlist found",
          wish: { products: [] },
        });
      }

      // Filter null product references
      const valid = wish.products.filter((p) => p.productId != null);
      if (valid.length !== wish.products.length) {
        wish.products = valid;
        await wish.save();
      }

      return res.status(200).json({
        success: true,
        wish,
      });
    } catch (error) {
      next(error);
    }
  };

  static deleteWish = async (req, res, next) => {
    try {
      const { productId } = req.body;
      const userId = req.user._id;

      if (!productId) {
        return res.status(400).json({ success: false, message: "productId is required" });
      }

      const updatedWishlist = await wishlistModel.findOneAndUpdate(
        { userId },
        { $pull: { products: { productId: productId } } },
        { new: true }
      ).populate("products.productId");

      return res.status(200).json({
        success: true,
        message: "Product removed from wishlist successfully",
        wish: updatedWishlist || { products: [] },
      });
    } catch (error) {
      next(error);
    }
  };

  // ==========================================
  // ORDERS & CHECKOUT OPERATIONS
  // ==========================================
  static createOrder = async (req, res, next) => {
    try {
      const userId = req.user._id;
      const { shippingAddress, paymentMethod = "COD", items } = req.body;

      if (!shippingAddress || !shippingAddress.name || !shippingAddress.phone || !shippingAddress.address || !shippingAddress.city || !shippingAddress.pincode) {
        return res.status(400).json({
          success: false,
          message: "Complete delivery address with name, phone, address, city, and pincode is required",
        });
      }

      let orderProducts = [];
      let totalAmount = 0;

      // Use items from request or fetch user's cart
      if (items && Array.isArray(items) && items.length > 0) {
        for (const item of items) {
          const prodId = item.productId || item.product || item._id;
          const prod = await ProductModel.findById(prodId);
          if (prod) {
            const qty = Number(item.quantity) || 1;
            orderProducts.push({
              product: prod._id,
              quantity: qty,
              price: prod.price,
            });
            totalAmount += prod.price * qty;
          }
        }
      } else {
        const cart = await CartModel.findOne({ userId }).populate("products.productId");
        if (!cart || !cart.products || cart.products.length === 0) {
          return res.status(400).json({
            success: false,
            message: "Cannot checkout with an empty basket",
          });
        }

        for (const item of cart.products) {
          if (item.productId) {
            const qty = item.quantity || 1;
            orderProducts.push({
              product: item.productId._id,
              quantity: qty,
              price: item.productId.price,
            });
            totalAmount += item.productId.price * qty;
          }
        }
      }

      if (orderProducts.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No valid products found for order",
        });
      }

      // Add delivery charges if below threshold
      const deliveryCharge = totalAmount > 500 ? 0 : 40;
      totalAmount += deliveryCharge;

      const order = await Order.create({
        user: userId,
        products: orderProducts,
        totalAmount,
        shippingAddress: {
          name: shippingAddress.name,
          phone: shippingAddress.phone,
          address: shippingAddress.address,
          city: shippingAddress.city,
          state: shippingAddress.state || "Odisha",
          pincode: shippingAddress.pincode,
        },
        paymentMethod,
        paymentStatus: paymentMethod === "COD" ? "PENDING" : "PAID",
        orderStatus: "PLACED",
      });

      // Clear user's cart after successful order creation
      await CartModel.findOneAndUpdate({ userId }, { $set: { products: [] } });

      const populatedOrder = await Order.findById(order._id).populate("products.product");

      return res.status(201).json({
        success: true,
        message: "Order placed successfully! We will prepare your fresh harvest dispatch.",
        order: populatedOrder,
      });
    } catch (error) {
      next(error);
    }
  };

  static getMyOrders = async (req, res, next) => {
    try {
      const orders = await Order.find({ user: req.user._id })
        .populate("products.product")
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      next(error);
    }
  };

  static getAllOrders = async (req, res, next) => {
    try {
      const orders = await Order.find()
        .populate("user", "name email phone")
        .populate("products.product")
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        count: orders.length,
        orders,
      });
    } catch (error) {
      next(error);
    }
  };

  static updateOrderStatus = async (req, res, next) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;

      const validStatuses = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        });
      }

      const order = await Order.findByIdAndUpdate(
        orderId,
        {
          orderStatus: status,
          ...(status === "DELIVERED" ? { paymentStatus: "PAID" } : {}),
        },
        { new: true }
      ).populate("user", "name email phone").populate("products.product");

      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }

      return res.status(200).json({
        success: true,
        message: `Order status updated to ${status}`,
        order,
      });
    } catch (error) {
      next(error);
    }
  };

  // Backward compatibility alias for shipOrder
  static shipOrder = async (req, res, next) => {
    req.body.status = "SHIPPED";
    return HandleController.updateOrderStatus(req, res, next);
  };

  // ==========================================
  // OTP OPERATIONS
  // ==========================================
  static GenerateOtp = async (req, res, next) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ success: false, message: "Email is required" });
      }

      const existingUser = await UserModel.findOne({ email: email.toLowerCase().trim() });
      if (!existingUser) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const hashedOtp = await bcrypt.hash(otp, 10);

      await OtpModel.create({
        email: email.toLowerCase().trim(),
        otp: hashedOtp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      });

      try {
        await sendEmail(email, otp);
      } catch (mailErr) {
        console.warn("Mail send warning:", mailErr.message);
      }

      return res.status(200).json({
        success: true,
        message: "OTP sent successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  static VerifyOtp = async (req, res, next) => {
    try {
      const { email, otp } = req.body;
      if (!email || !otp) {
        return res.status(400).json({ success: false, message: "Email and OTP are required" });
      }

      const findOtp = await OtpModel.findOne({ email: email.toLowerCase().trim() }).sort({ createdAt: -1 });
      if (!findOtp) {
        return res.status(404).json({ success: false, message: "OTP not found or expired" });
      }

      if (new Date() > new Date(findOtp.expiresAt)) {
        await OtpModel.deleteOne({ _id: findOtp._id });
        return res.status(400).json({ success: false, message: "OTP has expired" });
      }

      const matching = await bcrypt.compare(otp.toString(), findOtp.otp);
      if (!matching) {
        return res.status(400).json({ success: false, message: "Invalid OTP" });
      }

      const user = await UserModel.findOne({ email: email.toLowerCase().trim() });
      const token = jwt.sign(
        { _id: user._id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
      });

      await OtpModel.deleteOne({ _id: findOtp._id });

      return res.status(200).json({
        success: true,
        message: "OTP verified successfully",
        token,
        user,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default HandleController;
