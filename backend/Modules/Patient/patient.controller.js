import { Patient } from "../../Database/Models/patient.model.js";

// Create patient profile (only for users with role = "patient")
export const createPatientProfile = async (req, res) => {
  try {
    // Get user id from JWT (set by auth middleware)
    const userId = req.user.id || req.user._id;

    const { age, gender, phone } = req.body;

    // Check if patient profile already exists
    const existingProfile = await Patient.findOne({ user: userId });
    if (existingProfile) {
      return res.status(400).json({
        message: "Patient profile already exists",
      });
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
    console.error("Create patient profile error:", error);
    res.status(500).json({
      message: "Failed to create patient profile",
      error: error.message,
    });
  }
};

// Get my patient profile
export const getMyPatientProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const patient = await Patient.findOne({ user: userId }).populate(
      "user",
      "name email role",
    );

    if (!patient) {
      return res.status(404).json({
        message: "Patient profile not found",
      });
    }

    res.status(200).json({
      patient,
    });
  } catch (error) {
    console.error("Get patient profile error:", error);
    res.status(500).json({
      message: "Failed to get patient profile",
      error: error.message,
    });
  }
};
