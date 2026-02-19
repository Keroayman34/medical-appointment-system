import mongoose from "mongoose";

// Patient profile is linked to a User
const patientSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One profile per user
    },

    phone: {
      type: String,
    },

    age: {
      type: Number,
    },

    gender: {
      type: String,
      enum: ["male", "female"],
    },
  },
  { timestamps: true },
);

export const Patient = mongoose.model("Patient", patientSchema);
