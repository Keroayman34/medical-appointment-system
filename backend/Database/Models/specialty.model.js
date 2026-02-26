import mongoose from "mongoose";

const specialtySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

specialtySchema.index(
  { name: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
);

const Specialty = mongoose.model("Specialty", specialtySchema);

export default Specialty;