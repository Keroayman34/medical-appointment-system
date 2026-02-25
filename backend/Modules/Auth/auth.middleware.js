import jwt from "jsonwebtoken";
import { config } from "../Config/env.js";
import User from "../Database/Models/user.model.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);

    // NOTE: we use decoded._id because that's what we signed in the token
    const user = await User.findById(decoded._id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.isActive === false) {
      return res.status(403).json({ message: "User is blocked" });
    }

    req.user = user; // attach user to request
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// Allow only specific roles
export const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};
