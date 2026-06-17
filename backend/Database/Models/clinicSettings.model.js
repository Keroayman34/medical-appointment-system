import mongoose from "mongoose";

const clinicSettingsSchema = new mongoose.Schema(
  {
    clinicName: {
      type: String,
      default: "Medical Appointment Clinic",
      trim: true,
    },
    supportEmail: {
      type: String,
      default: "",
      trim: true,
    },
    supportPhone: {
      type: String,
      default: "",
      trim: true,
    },
    address: {
      type: String,
      default: "",
      trim: true,
    },
    timezone: {
      type: String,
      default: "UTC",
      trim: true,
    },
    appointmentDurationMinutes: {
      type: Number,
      default: 30,
      min: 5,
      max: 240,
    },
    cancellationWindowHours: {
      type: Number,
      default: 24,
      min: 0,
      max: 720,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export const ClinicSettings = mongoose.model(
  "ClinicSettings",
  clinicSettingsSchema,
);
