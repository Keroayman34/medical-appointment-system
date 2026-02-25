import mongoose from "mongoose";

const specialtySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true, // admin can disable a specialty without deleting it
    },
  },
  { timestamps: true },
);

// Index to prevent duplicate names (case insensitive)
specialtySchema.index({ name: 1 }, { unique: true });

const Specialty = mongoose.model("Specialty", specialtySchema);

export default Specialty;
