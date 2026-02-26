import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Doctor from "./doctor.model.js";
import { Patient } from "./patient.model.js";
import { Availability } from "./availability.model.js";
import { Appointment } from "./appointment.model.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "doctor", "patient"],
      default: "patient",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    address: {
      type: String,
      default: "",
      trim: true,
    },

    gender: {
      type: String,
      enum: ["male", "female"],
      default: "male",
    },

    dob: {
      type: String,
      default: "",
      trim: true,
    },

    image: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

userSchema.post("findOneAndDelete", async function (deletedUser, next) {
  try {
    if (!deletedUser) return next();

    const userId = deletedUser._id;

    const [doctorProfile, patientProfile] = await Promise.all([
      Doctor.findOneAndDelete({ user: userId }),
      Patient.findOneAndDelete({ user: userId }),
    ]);

    if (doctorProfile) {
      await Availability.deleteMany({ doctor: doctorProfile._id });
    }

    const appointmentFilters = [
      { createdBy: userId },
      { patient: userId },
      { doctor: userId },
    ];

    if (doctorProfile) {
      appointmentFilters.push({ doctor: doctorProfile._id });
    }

    if (patientProfile) {
      appointmentFilters.push({ patient: patientProfile._id });
    }

    await Appointment.deleteMany({ $or: appointmentFilters });

    next();
  } catch (error) {
    next(error);
  }
});
const User = mongoose.model("User", userSchema);
export default User;
