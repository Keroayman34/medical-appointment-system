import Joi from "joi";

export const addAvailabilitySchema = Joi.object({
  day: Joi.string()
    .valid(
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    )
    .required()
    .messages({
      "any.required": "Day is required",
      "string.empty": "Day cannot be empty",
    }),

  from: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required()
    .messages({
      "any.required": "From time is required",
      "string.empty": "From time cannot be empty",
      "string.pattern.base": "From time must be in HH:mm format",
    }),

  to: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required()
    .messages({
      "any.required": "To time is required",
      "string.empty": "To time cannot be empty",
      "string.pattern.base": "To time must be in HH:mm format",
    }),
});
