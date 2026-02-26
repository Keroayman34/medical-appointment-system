import { Availability } from "../../Database/Models/availability.model.js";
import Doctor from "../../Database/Models/doctor.model.js";

export const addAvailability = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { day, from, to } = req.body;
    const normalizedDay = day?.trim().toLowerCase();
    const normalizedFrom = from?.trim();
    const normalizedTo = to?.trim();

    const doctor = await Doctor.findOne({ user: userId });
    if (!doctor) {
      const error = new Error("Doctor profile not found");
      error.statusCode = 404;
      return next(error);
    }

    const existingAvailability = await Availability.findOne({
      doctor: doctor._id,
      day: normalizedDay,
      from: normalizedFrom,
      to: normalizedTo,
    });

    if (existingAvailability) {
      return res.status(409).json({
        message: "This availability slot already exists",
      });
    }

    const availability = await Availability.create({
      doctor: doctor._id,
      day: normalizedDay,
      from: normalizedFrom,
      to: normalizedTo,
    });

    res.status(201).json({
      message: "Availability added successfully",
      availability,
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({
        message: "This availability slot already exists",
      });
    }

    next(error);
  }
};

export const getDoctorAvailability = async (req, res, next) => {
  try {
    const { doctorId } = req.params;

    let doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      doctor = await Doctor.findOne({ user: doctorId });
    }

    if (!doctor) {
      const error = new Error("Doctor profile not found");
      error.statusCode = 404;
      return next(error);
    }

    const availability = await Availability.find({ doctor: doctor._id });

    res.json({ availability });
  } catch (error) {
    next(error);
  }
};

export const getMyAvailability = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });

    if (!doctor) {
      const error = new Error("Doctor profile not found");
      error.statusCode = 404;
      return next(error);
    }

    const availability = await Availability.find({ doctor: doctor._id });

    res.json({ availability });
  } catch (error) {
    next(error);
  }
};
