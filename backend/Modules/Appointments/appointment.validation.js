import Joi from "joi";

<<<<<<< HEAD
// Validation for booking an appointment
export const bookAppointmentSchema = Joi.object({
  doctorId: Joi.string().hex().length(24).required(), // Mongo ObjectId
  date: Joi.date().required(),
  time: Joi.string()
    .pattern(/^\d{2}:\d{2}$/)
    .required(), // HH:MM
});

// Validation for updating appointment status
export const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid("pending", "confirmed", "cancelled", "completed")
    .required(),
});
=======
export const createAppointmentValidation = Joi.object({
  doctor: Joi.string().hex().length(24).required(),
  patient: Joi.string().hex().length(24).required(),
  date: Joi.date().required(),
  startTime: Joi.string().required(),
  endTime: Joi.string().required(),
});
>>>>>>> 1d67657 (update appointment validation and gitignore)
