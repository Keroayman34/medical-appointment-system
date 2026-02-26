import Joi from "joi";

// Validation schema for user registration
export const registerSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),

  email: Joi.string().email().required(),

  password: Joi.string().min(6).required(),

  role: Joi.string().valid("patient", "doctor").optional(),

  phone: Joi.string().trim().allow("").optional(),

  gender: Joi.string().valid("male", "female").optional(),

  age: Joi.number().min(0).max(130).optional(),
});

// Validation schema for user login
export const loginSchema = Joi.object({
  email: Joi.string().email().required(),

  password: Joi.string().min(6).required(),
});
