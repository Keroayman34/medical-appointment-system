import Joi from "joi";

export const updatePatientProfileSchema = Joi.object({
  age: Joi.number().integer().min(0).max(130),
  gender: Joi.string().valid("male", "female"),
  phone: Joi.string().trim().min(6).max(30),
  medicalHistory: Joi.string().trim().max(5000),
}).min(1);
