import mongoose from "mongoose";

// Doctor profile is linked to a User
const doctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One profile per user
    },

    specialty: {
      type: String,
      required: true,
    },

    bio: {
      type: String,
    },

    phone: {
      type: String,
    },

    isApproved: {
      type: Boolean,
      default: false, // Admin can approve doctors
    },
  },
  { timestamps: true },
);

export const Doctor = mongoose.model("Doctor", doctorSchema);
