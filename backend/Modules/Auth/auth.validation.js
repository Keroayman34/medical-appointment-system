import Joi from "joi";

// Validation schema for user registration
export const registerSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),

  email: Joi.string().email().required(),

  password: Joi.string().min(6).required(),

  role: Joi.string().valid("patient", "doctor").optional(),

  phone: Joi.string().trim().allow("").optional(),

  address: Joi.string().trim().allow("").optional(),

  gender: Joi.string().valid("male", "female").optional(),

  age: Joi.number().min(0).max(130).optional(),

  specialtyId: Joi.when("role", {
    is: "doctor",
    then: Joi.string().hex().length(24).required(),
    otherwise: Joi.forbidden(),
  }),

  bio: Joi.string().trim().allow("").optional(),

  fees: Joi.number().min(0).optional(),

  experienceYears: Joi.number().min(0).optional(),
});

// Validation schema for user login
export const loginSchema = Joi.object({
  email: Joi.string().email().required(),

  password: Joi.string().min(6).required(),
});
