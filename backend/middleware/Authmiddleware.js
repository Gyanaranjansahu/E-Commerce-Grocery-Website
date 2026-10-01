import jwt from "jsonwebtoken";
import listed from "../model/Blacklist.js";

const Authmiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token =
      req.cookies?.token ||
      (authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : authHeader);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      });
    }

    const is_blacklist = await listed.findOne({ token: token });
    if (is_blacklist) {
      return res.status(401).json({
        success: false,
        message: "Session expired, please log in again",
      });
    }

    const secret = process.env.JWT_SECRET || "hifdub.089hjkfmol";
    const decoded = jwt.verify(token, secret);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid token",
      });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid or expired token",
      error: err.message,
    });
  }
};

export default Authmiddleware;