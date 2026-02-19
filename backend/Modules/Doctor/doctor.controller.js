import { Doctor } from "../../Database/Models/doctor.model.js";

export const createDoctorProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const { specialty, bio, phone } = req.body;

    const existingProfile = await Doctor.findOne({ user: userId });
    if (existingProfile) {
      return res.status(400).json({
        message: "Doctor profile already exists",
      });
    }

    const doctor = await Doctor.create({
      user: userId, 
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

export const getMyDoctorProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

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
