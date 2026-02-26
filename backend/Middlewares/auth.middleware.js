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
      const err = new Error("Not authorized, no token");
      err.statusCode = 401;
      return next(err);
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);

    const user = await User.findById(decoded._id).select("-password");

    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 401;
      return next(err);
    }

    if (!user.isActive) {
      const err = new Error("User is blocked");
      err.statusCode = 403;
      return next(err);
    }

    req.user = user;
    next();
  } catch (error) {
    error.statusCode = 401;
    error.message = "Not authorized, token failed";
    next(error);
  }
};

export const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      const err = new Error("Access denied");
      err.statusCode = 403;
      return next(err);
    }
    next();
  };
};
