import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    slotDate: {
      type: String,
      required: true,
      trim: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    consultationNotes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true },
);

appointmentSchema.pre("validate", function setSlotDate(next) {
  if (this.date) {
    const parsedDate = new Date(this.date);
    if (!Number.isNaN(parsedDate.getTime())) {
      this.slotDate = parsedDate.toISOString().split("T")[0];
    }
  }
  next();
});

appointmentSchema.index(
  { doctor: 1, slotDate: 1, startTime: 1 },
  { unique: true },
);

export const Appointment = mongoose.model("Appointment", appointmentSchema);
