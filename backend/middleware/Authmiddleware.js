
import jwt from "jsonwebtoken";

const Authmiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.Access_token;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_SECRET_TOKEN
    );

    req.user = decoded;
    // Ensure both id and _id are available on req.user for compatibility
    if (decoded && decoded.id && !decoded._id) {
      req.user._id = decoded.id;
    }
    if (decoded && decoded._id && !decoded.id) {
      req.user.id = decoded._id;
    }

    next();

  } catch (err) {
    return res.status(401).json({
      message: "Unauthorized",
      success: false
    });
  }
};

export default Authmiddleware;
