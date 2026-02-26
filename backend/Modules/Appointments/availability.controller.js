import { Availability } from "../../Database/Models/availability.model.js";
import Doctor from "../../Database/Models/doctor.model.js";

export const addAvailability = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { day, from, to } = req.body;

    const doctor = await Doctor.findOne({ user: userId });
    if (!doctor) {
      const error = new Error("Doctor profile not found");
      error.statusCode = 404;
      return next(error);
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
    next(error);
  }
};

export const getDoctorAvailability = async (req, res, next) => {
  try {
    const { doctorId } = req.params;

    const availability = await Availability.find({ doctor: doctorId });

    res.json({ availability });
  } catch (error) {
    next(error);
  }
};
