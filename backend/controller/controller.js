import UserModel from "../model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import OtpModel from "../model/otpSchema.js";
import sendEmail from "../config/mail.js";
import CartModel from "../model/cartSchema.js";
import uploadToCloud from "../config/uploadtocloud.js";
import fs from "fs";
import ProductModel from "../model/product.js";
import wishlistModel from "../model/wishlistModel.js";
import { Verify } from "crypto";
class HandleController {
  static Register = async (req, res, next) => {
    try {
      let { name, email, password, phone, landmark, area, pin, flat, city } =
        req.body;
      console.log("Request Body:", req.body);

      // Support either 'landmark' or 'area' from frontend
      const finalLandmark = landmark || area;

      if (
        !name ||
        !email ||
        !password ||
        !phone ||
        !finalLandmark ||
        !pin ||
        !flat ||
        !city
      ) {
        return res.status(400).json({ message: "All fields are required" });
      }

      if (!req.file) {
        return res.status(400).json({
          message: "Profile photo Required",
        });
      }

      // Get local file path from Multer
      const profileImagePath = req.file.path;

      // Upload to Cloudinary
      const imgurl = await uploadToCloud(profileImagePath, "profile");

      // Clean up temporary local file from /uploads folder
      try {
        if (fs.existsSync(profileImagePath)) {
          fs.unlinkSync(profileImagePath);
        }
      } catch (cleanupErr) {
        console.warn("Failed to delete temp file:", cleanupErr.message);
      }

      // Check admin role
      const admin = await UserModel.findOne({ role: "admin" });
      if (!admin && process.env.ADMIN_EMAIL) {
        const adminPass = process.env.ADMIN_PASSWORD || "admin123";
        let hashedAdminPassword = await bcrypt.hash(adminPass, 10);
        let Admin = new UserModel({
          name: "Admin",
          email: process.env.ADMIN_EMAIL,
          password: hashedAdminPassword,
          profileImage:
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
          phone: "+917846813554",
          role: "admin",
          flat: "HQ",
          landmark: "HQ",
          city: "HQ",
          pin: "000000",
        });
        await Admin.save();
      }

      let user = await UserModel.findOne({ email: email });
      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }

      let hashedPassword = await bcrypt.hash(password, 10);
      let newUser = new UserModel({
        name,
        email,
        password: hashedPassword,
        profileImage: imgurl, // Saved as Cloudinary secure_url
        phone,
        landmark: finalLandmark,
        pin,
        city,
        flat,
      });

      await newUser.save();
      return res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      console.error("Register Error:", err);
      next(err);
    }
  };

static Login = async (req, res, next) => {
  let { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "All fields are required"
    });
  }

  try {
    let user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found"
      });
    }

    let isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password"
      });
    }

    const payload = {
      email: user.email,
      id: user._id,
      _id: user._id,
      role: user.role
    };

    const Access_generateToken = jwt.sign(
      payload,
      process.env.ACCESS_SECRET_TOKEN,
      { expiresIn: "15m" }
    );

    const Refresh_generateToken = jwt.sign(
      payload,
      process.env.REFRESH_SECRET_TOKEN,
      { expiresIn: "7d" }
    );

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    };

    res.cookie("Access_token", Access_generateToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000
    });

    res.cookie("Refresh_token", Refresh_generateToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      message: "Login successful",
      success: true
    });

  } catch (err) {
    next(err);
  }
};



static Refresh = async (req, res, next) => {
  try {
    let Refresh_token = req.cookies.Refresh_token;

    if (!Refresh_token) {
      return res.status(401).json({
        message: "Refresh token not found. Please login again"
      });
    }

    let verify = jwt.verify(
      Refresh_token,
      process.env.REFRESH_SECRET_TOKEN
    );

    if (!verify) {
      return res.status(401).json({
        message: "Session expired. Please login again"
      });
    }

    // Generate new Access Token
    let Access_token = jwt.sign(
      {
        email: verify.email,
        id: verify.id || verify._id,
        _id: verify._id || verify.id,
        role: verify.role
      },
      process.env.ACCESS_SECRET_TOKEN,
      { expiresIn: "15m" }
    );

    res.cookie("Access_token", Access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 15 * 60 * 1000
    });

    return res.status(200).json({
      message: "Access token generated successfully",
      success: true
    });

  } catch (error) {
    if (error.name === "TokenExpiredError" ||
        error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Session expired. Please login again",
        success: false
      });
    }

    next(error);
  }
};



  static GenerateOtp = async (req, res, next) => {
    try {
      const { email } = req.body;

      // 1. Validation check
      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required",
        });
      }
      const existingUser = await UserModel.findOne({ email });
      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // 2. Generate 5-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // 3. Expiration time (3 minutes from now)
      const timeOtp = new Date(Date.now() + 3 * 60 * 1000);

      // 4. Hash the OTP (Must use await)
      const bcryptOtp = await bcrypt.hash(otp, 10);

      // 5. Store in database
      await OtpModel.create({
        email: email,
        otp: bcryptOtp, // Pass the hashed value here
        expiresAt: timeOtp,
      });

      // 6. Send the plain-text OTP via email
      await sendEmail(email, otp);

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
          return res.status(400).json({
            success: false,
            message: "Email and OTP are required",
          });
        }

        // Find the latest OTP for this email
        const findUser = await OtpModel.findOne({ email }).sort({ createdAt: -1 });

        if (!findUser) {
          return res.status(404).json({
            success: false,
            message: "OTP request not found or expired",
          });
        }

        // Check Expiry using expiresAt
        if (new Date() > new Date(findUser.expiresAt)) {
          await OtpModel.deleteOne({ _id: findUser._id });
          return res.status(400).json({
            success: false,
            message: "OTP has expired",
          });
        }

        // Compare Hashes (Must use await)
        const matching = await bcrypt.compare(otp.toString(), findUser.otp);
        if (!matching) {
          return res.status(400).json({
            success: false,
            message: "Invalid OTP",
          });
        }
        // let token=await jwt.sign({_id:findUser._id,user:findUser.email,role:findUser.role},"hifdub.089hjkfmol")
        // res.cookie("token",token )

        // Cleanup used OTP from database
        await OtpModel.deleteOne({ _id: findUser._id });

        return res.status(200).json({
          success: true,
          message: "OTP verified successfully",
        });
      } catch (error) {
        next(error);
      }
    };


 
static Logout = async (req, res) => {
  try {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    };
    res.clearCookie("Access_token", cookieOptions);
    res.clearCookie("Refresh_token", cookieOptions);
    return res.status(200).json({
      message: "Logged out successfully",
      success: true
    });
  } catch (error) {
    return res.status(500).json({
      message: "Logout failed",
      success: false
    });
  }
};

static changePassword = async (req, res) => {
  try {
    let { email, newPassword } = req.body;

    let isExist = await UserModel.findOne({ email });

    if (!isExist) {
      return res.status(404).json({
        message: "User not exist",
        success: false
      });
    }

    let hashpass = await bcrypt.hash(newPassword, 10);

    await UserModel.updateOne(
      { email },
      { $set: { password: hashpass } }
    );

    return res.status(200).json({
      message: "Password Updated Successfully",
      success: true
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      success: false
    });
  }
};
 
 static GetUser = async (req, res, next) => {
    try {
      const userId = req.user?._id || req.user?.id;
      const user = await UserModel.findById(userId).select(
        "-password -__v -createdAt -updatedAt"
      );
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json({ user });
    } catch (err) {
      next(err);
    }
  };

static AddtoCart = async (req, res, next) => {
  try {
    const { productId } = req.body;
    // Default to 1 if not sent from the frontend
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
        (product) => product.productId.toString() === productId
      );

      if (exist) {
        exist.quantity += quantity; // Increments by 1 (or by whatever quantity was passed)
      } else {
        cart.products.push({ productId, quantity });
      }

      await cart.save();
    } else {
      cart = new CartModel({
        userId,
        products: [{ productId, quantity }],
      });

      await cart.save();
    }

    return res.status(200).json({ message: "Product added to cart", cart });
  } catch (err) {
    next(err);
  }
};
  static viewCart = async (req, res, next) => {
    try {
      const cart = await CartModel.findOne({ userId: req.user._id }).populate(
        "products.productId",
      );
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
      return res.status(200).json({ 
     data: cart
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
      const exist = cart.products.find(
        (product) => product.productId.toString() === productId,
      );
      if (!exist) {
        return res.status(404).json({ message: "Product not found in cart" });
      }
      cart.products = cart.products.filter(
        (product) => product.productId.toString() !== productId,
      );
      await cart.save();
      return res.status(200).json({ message: "Product removed from cart" });
    } catch (err) {
      next(err);
    }
  };

  static clearCart = async (req, res, next) => {
    try {
      const cart = await CartModel.findOne({ userId: req.user._id });
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
      cart.products = [];
      await cart.save();
      return res.status(200).json({ message: "Cart cleared" });
    } catch (err) {
      next(err);
    }
  };

  static updateCart = async (req, res, next) => {
    try {
      const { productId, quantity } = req.body;
      if (!productId || !quantity) {
        return res.status(400).json({ message: "All fields are required" });
      }
      const cart = await CartModel.findOne({ userId: req.user._id });
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
      const exist = cart.products.find(
        (product) => product.productId.toString() === productId,
      );
      if (!exist) {
        return res.status(404).json({ message: "Product not found in cart" });
      }
      exist.quantity = quantity;
      await cart.save();
      return res.status(200).json({ message: "Cart updated" });
    } catch (err) {
      next(err);
    }
  };

  static createProduct = async (req, res, next) => {
    try {
      const { name, description, price, category, image, quantity } = req.body;
      let data = await ProductModel.create({
        name,
        description,
        price,
        category,
        image,
        quantity,
      });

      return res.status(200).json({
        message: "Item Added",
      });
    } catch (error) {
      next(error);
    }
  };

  static getAdmin = async (req, res, next) => {
    try {
      let admin_id = req.user._id;
      let find = await UserModel.findById({ _id: admin_id }).select("-password");
      if (!find || find.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }
      return res.status(200).json({
        message: "admin",
       admin:  find,
      });
    } catch (error) {
      next(error);
    }
  };

static viewProduct = async (req, res, next) => {
    try {
      const products = await ProductModel.find({})
console.log(products);

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



  static WishList = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }

    // 1. Query by userId object
    let wishlist = await wishlistModel.findOne({ userId });

    // 2. If wishlist document does not exist, create it with the first product
    if (!wishlist) {
      wishlist = await wishlistModel.create({
        userId,
        products: [{ productId }]
      });

      return res.status(201).json({
        success: true,
        message: "Add to Wishlist",
        wishlist
      });
    }

    // 3. Check if the product already exists in the wishlist
    const exists = wishlist.products.some(
      (item) => item.productId.toString() === productId.toString()
    );

    let responseMessage = "";

    if (exists) {
      // Reassign filtered array to mutate the document
      wishlist.products = wishlist.products.filter(
        (item) => item.productId.toString() !== productId.toString()
      );
      responseMessage = "Removed from Wishlist";
    } else {
      // Add product if not present
      wishlist.products.push({ productId });
      responseMessage = "Added to Wishlist";
    }

    await wishlist.save();

    return res.status(200).json({
      success: true,
      message: responseMessage,
      wishlist
    });
  } catch (error) {
    next(error);
  }
};

static getCart = async (req, res, next) => {
  try {
    const id = req.user?._id;

    if (!id) {
      return res.status(401).json({
        message: "Unauthorized: Invalid credentials",
      });
    }

    // Use findOne to return a single document or null
    const cart = await CartModel.findOne({ userId: id })
      .populate("products.productId")
      .lean();

    // Check if the cart doesn't exist or has no products
    if (!cart || cart.products.length === 0) {
      return res.status(200).json({
        message: "Cart is empty",
        cart: cart || { products: [] },
      });
    }

    return res.status(200).json({
      cart,
    });
  } catch (error) {
    next(error);
  }
};
static getWish = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Use findOne({ userId }) or findOne({ user: userId })
    // depending on your schema definition
    const wish = await wishlistModel
      .findOne({ userId }) // or { user: userId }
      .populate("products.productId");

    // If no wishlist exists yet, return empty list instead of throwing an error
    if (!wish) {
      return res.status(200).json({
        success: true,
        message: "No wishlist found",
        wish: { products: [] }
      });
    }

    return res.status(200).json({
      success: true,
      wish,
      message:"wishlist "
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
      return res.status(400).json({
        success: false,
        message: "productId is required"
      });
    }

    // Replace 'products' with your schema's actual array field name (e.g. items, products)
    // Replace 'userId' with your schema's user reference field name (e.g. user, userId)
    const updatedWishlist = await wishlistModel.findOneAndUpdate(
      { userId: userId },
      { $pull: { products: productId } }, // or { products: { productId: productId } } if objects
      { new: true }
    );

    if (!updatedWishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found for this user"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product removed from wishlist successfully",
      wishlist: updatedWishlist
    });

  } catch (error) {
    next(error);
  }
};
}

export default HandleController;
