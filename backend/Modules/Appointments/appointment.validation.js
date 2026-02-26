import Joi from "joi";

export const bookAppointmentSchema = Joi.object({
  doctorId: Joi.string().hex().length(24).required(),
  date: Joi.date().required(),
  startTime: Joi.string()
    .pattern(/^\d{2}:\d{2}$/)
    .required(), 
  endTime: Joi.string()
    .pattern(/^\d{2}:\d{2}$/)
    .required(), 
});

export const updateStatusSchema = Joi.object({
  status: Joi.string().valid("confirmed", "cancelled", "completed").required(),
});

export const consultationNotesSchema = Joi.object({
  consultationNotes: Joi.string().trim().min(3).max(5000).required(),
});

export const rescheduleAppointmentSchema = Joi.object({
  date: Joi.date().required(),
  startTime: Joi.string()
    .pattern(/^\d{2}:\d{2}$/)
    .required(),
  endTime: Joi.string()
    .pattern(/^\d{2}:\d{2}$/)
    .required(),
});

export const createAppointmentValidation = Joi.object({
  doctor: Joi.string().hex().length(24).required(),
  patient: Joi.string().hex().length(24).required(),
  date: Joi.date().required(),
  startTime: Joi.string().required(),
  endTime: Joi.string().required(),
});
