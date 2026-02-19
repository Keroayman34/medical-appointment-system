import { Availability } from "../../Database/Models/availability.model.js";
import { Doctor } from "../../Database/Models/doctor.model.js";

// Doctor adds availability
export const addAvailability = async (req, res) => {
  try {
    const userId = req.user._id; // from token
    const { day, from, to } = req.body;

    // Find doctor profile by user id
    const doctor = await Doctor.findOne({ user: userId });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

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
    console.error(error);
    res.status(500).json({ message: "Failed to add availability" });
  }
};

// Get availability for a doctor
export const getDoctorAvailability = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const availability = await Availability.find({ doctor: doctorId });

    res.json({ availability });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get availability" });
  }
};
