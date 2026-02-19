import { Doctor } from "../../Database/Models/doctor.model.js";

// Create doctor profile (only for users with role = "doctor")
export const createDoctorProfile = async (req, res) => {
  try {
    // The user id comes from the auth middleware (decoded JWT)
    const userId = req.user.id || req.user._id;

    const { specialty, bio, phone } = req.body;

    // Check if doctor profile already exists for this user
    const existingProfile = await Doctor.findOne({ user: userId });
    if (existingProfile) {
      return res.status(400).json({
        message: "Doctor profile already exists",
      });
    }

    // Create new doctor profile linked to the logged-in user
    const doctor = await Doctor.create({
      user: userId, // Link doctor profile to the user
      specialty,
      bio,
      phone,
    });

    res.status(201).json({
      message: "Doctor profile created successfully",
      doctor,
    });
  } catch (error) {
    console.error("Create doctor profile error:", error);
    res.status(500).json({
      message: "Failed to create doctor profile",
      error: error.message,
    });
  }
};

// Get my doctor profile (for the logged-in doctor)
export const getMyDoctorProfile = async (req, res) => {
  try {
    // Get user id from token
    const userId = req.user.id || req.user._id;

    // Find doctor profile linked to this user
    const doctor = await Doctor.findOne({ user: userId }).populate(
      "user",
      "name email role",
    );

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor profile not found",
      });
    }

    res.status(200).json({
      doctor,
    });
  } catch (error) {
    console.error("Get doctor profile error:", error);
    res.status(500).json({
      message: "Failed to get doctor profile",
      error: error.message,
    });
  }
};
