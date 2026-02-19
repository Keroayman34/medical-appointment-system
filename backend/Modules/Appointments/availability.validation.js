import Joi from "joi";

// Validation schema for adding availability
export const addAvailabilitySchema = Joi.object({
  day: Joi.string().required().messages({
    "any.required": "Day is required",
    "string.empty": "Day cannot be empty",
  }),

  from: Joi.string().required().messages({
    "any.required": "From time is required",
    "string.empty": "From time cannot be empty",
  }),

  to: Joi.string().required().messages({
    "any.required": "To time is required",
    "string.empty": "To time cannot be empty",
  }),
});
