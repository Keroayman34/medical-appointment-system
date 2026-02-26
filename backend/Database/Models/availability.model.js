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
      trim: true,
      lowercase: true,
    },
    from: {
      type: String,
      required: true,
      trim: true,
    },
    to: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

availabilitySchema.index(
  { doctor: 1, day: 1, from: 1, to: 1 },
  { unique: true },
);

export const Availability = mongoose.model("Availability", availabilitySchema);
