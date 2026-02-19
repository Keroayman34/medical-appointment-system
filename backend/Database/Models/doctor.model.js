import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    specialty: {
      type: String,
      required: true,
    },

    bio: String,

    phone: String,

    fees: Number,

    experienceYears: Number,

    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Doctor = mongoose.model("Doctor", doctorSchema);