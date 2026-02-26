import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    phone: String,

    age: Number,

    gender: {
      type: String,
      enum: ["male", "female"],
    },

    medicalHistory: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true },
);

export const Patient = mongoose.model("Patient", patientSchema);
