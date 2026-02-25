import { Router } from "express";
import { register, login } from "./auth.controller.js";
import { validate } from "../../Middlewares/validation.middleware.js";
import { registerSchema, loginSchema } from "./auth.validation.js";

const router = Router();

// Register with validation
router.post("/register", validate(registerSchema), register);

// Login with validation
router.post("/login", validate(loginSchema), login);

export default router;
