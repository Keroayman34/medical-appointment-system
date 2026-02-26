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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Specialty",
      required: true,
    },

    bio: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    fees: {
      type: Number,
      default: 0,
    },

    experienceYears: {
      type: Number,
      default: 0,
    },

  

    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;
