import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    day: {
      type: String, 
      required: true,
    },
    from: {
      type: String, 
      required: true,
    },
    to: {
      type: String, 
      required: true,
    },
  },
  { timestamps: true },
);

export const Availability = mongoose.model("Availability", availabilitySchema);
