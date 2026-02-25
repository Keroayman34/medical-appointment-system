import { Patient } from "../../Database/Models/patient.model.js";

// @desc    Create patient profile (only for users with role = "patient")
// @route   POST /patients
// @access  Patient
export const createPatientProfile = async (req, res, next) => {
  try {
    // Get user id from JWT (set by auth middleware)
    const userId = req.user.id || req.user._id;
    const { age, gender, phone } = req.body;

    // Check if patient profile already exists
    const existingProfile = await Patient.findOne({ user: userId });
    if (existingProfile) {
      const error = new Error("Patient profile already exists");
      error.statusCode = 400;
      return next(error);
    }

    // Create new patient profile
    const patient = await Patient.create({
      user: userId,
      age,
      gender,
      phone,
    });

    res.status(201).json({
      message: "Patient profile created successfully",
      patient,
    });
  } catch (error) {
    next(error); // forward to global error handler
  }
};

// @desc    Get my patient profile
// @route   GET /patients/me
// @access  Patient
export const getMyPatientProfile = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user._id;

    const patient = await Patient.findOne({ user: userId }).populate(
      "user",
      "name email role",
    );

    if (!patient) {
      const error = new Error("Patient profile not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      patient,
    });
  } catch (error) {
    next(error); // forward to global error handler
  }
};
