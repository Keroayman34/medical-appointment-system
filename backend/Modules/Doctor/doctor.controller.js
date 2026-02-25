import Doctor from "../../Database/Models/doctor.model.js";
import Specialty from "../../Database/Models/specialty.model.js";

// @desc    Create doctor profile (only for users with role = doctor)
// @route   POST /doctors
// @access  Doctor
export const createDoctorProfile = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user._id;
    const { specialtyId, bio, phone, fees, experienceYears } = req.body;

    // Check if specialty exists
    const specialty = await Specialty.findById(specialtyId);
    if (!specialty) {
      const error = new Error("Specialty not found");
      error.statusCode = 404;
      return next(error);
    }

    // Check if doctor profile already exists
    const existingProfile = await Doctor.findOne({ user: userId });
    if (existingProfile) {
      const error = new Error("Doctor profile already exists");
      error.statusCode = 400;
      return next(error);
    }

    const doctor = await Doctor.create({
      user: userId,
      specialty: specialtyId, // reference to Specialty
      bio,
      phone,
      fees,
      experienceYears,
    });

    res.status(201).json({
      message: "Doctor profile created successfully",
      doctor,
    });
  } catch (error) {
    next(error); // forward to global error handler
  }
};

// @desc    Get my doctor profile
// @route   GET /doctors/me
// @access  Doctor
export const getMyDoctorProfile = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user._id;

    const doctor = await Doctor.findOne({ user: userId })
      .populate("user", "name email role")
      .populate("specialty", "name description");

    if (!doctor) {
      const error = new Error("Doctor profile not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      doctor,
    });
  } catch (error) {
    next(error); // forward to global error handler
  }
};
