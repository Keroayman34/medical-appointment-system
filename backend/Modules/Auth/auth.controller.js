import jwt from "jsonwebtoken";
import { config } from "../../Config/env.js";
import User from "../../Database/Models/user.model.js";

const generateToken = (user) => {
  return jwt.sign({ _id: user._id, role: user.role }, config.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const formatUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone || "",
  address: user.address || "",
  gender: user.gender || "male",
  age: user.age ?? null,
  image: user.image || "",
});

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, gender, age } = req.body || {};

    if (!name || !email || !password) {
      const error = new Error("name, email and password are required");
      error.statusCode = 400;
      return next(error);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("Email already registered");
      error.statusCode = 400;
      return next(error);
    }

    const selectedRole = role === "doctor" ? "doctor" : "patient";

    const user = await User.create({
      name,
      email,
      password,
      role: selectedRole,
      phone: phone || "",
      gender: gender || "male",
      age: age ?? null,
    });

    const token = generateToken(user);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: formatUserResponse(user),
    });
  } catch (error) {
    if (error?.code === 11000 && error?.keyPattern?.email === 1) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      const error = new Error("email and password are required");
      error.statusCode = 400;
      return next(error);
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      const error = new Error("Invalid email or password");
      error.statusCode = 400;
      return next(error);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      const error = new Error("Invalid email or password");
      error.statusCode = 400;
      return next(error);
    }

    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      user: formatUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
};
