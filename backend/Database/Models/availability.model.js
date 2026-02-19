import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    day: {
      type: String, // e.g. "Sunday", "Monday"
      required: true,
    },
    from: {
      type: String, // e.g. "09:00"
      required: true,
    },
    to: {
      type: String, // e.g. "17:00"
      required: true,
    },
  },
  { timestamps: true },
);

export const Availability = mongoose.model("Availability", availabilitySchema);
