import { Availability } from "../../Database/Models/availability.model.js";
import Doctor from "../../Database/Models/doctor.model.js";

// @desc    Add availability (Doctor only)
// @route   POST /availability
// @access  Doctor
export const addAvailability = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { day, from, to } = req.body;

    // 1) Check doctor profile exists
    const doctor = await Doctor.findOne({ user: userId });
    if (!doctor) {
      const error = new Error("Doctor profile not found");
      error.statusCode = 404;
      return next(error);
    }

    // 2) Create availability
    const availability = await Availability.create({
      doctor: doctor._id,
      day,
      from,
      to,
    });

    res.status(201).json({
      message: "Availability added successfully",
      availability,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get doctor availability
// @route   GET /availability/:doctorId
// @access  Public
export const getDoctorAvailability = async (req, res, next) => {
  try {
    const { doctorId } = req.params;

    const availability = await Availability.find({ doctor: doctorId });

    res.json({ availability });
  } catch (error) {
    next(error);
  }
};
