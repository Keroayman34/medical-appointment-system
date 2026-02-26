import { Availability } from "../../Database/Models/availability.model.js";
import Doctor from "../../Database/Models/doctor.model.js";

const VALID_DAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const HH_MM_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

const toMinutes = (value) => {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
};

const hasOverlap = ({ from, to, slots }) => {
  const fromMinutes = toMinutes(from);
  const toMinutesValue = toMinutes(to);

  return slots.some((slot) => {
    const slotFrom = toMinutes(slot.from);
    const slotTo = toMinutes(slot.to);
    return fromMinutes < slotTo && toMinutesValue > slotFrom;
  });
};

export const addAvailability = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { day, from, to } = req.body;
    const normalizedDay = day?.trim().toLowerCase();
    const normalizedFrom = from?.trim();
    const normalizedTo = to?.trim();

    if (!VALID_DAYS.includes(normalizedDay)) {
      return res.status(400).json({
        message: "Invalid day value",
      });
    }

    if (!HH_MM_REGEX.test(normalizedFrom) || !HH_MM_REGEX.test(normalizedTo)) {
      return res.status(400).json({
        message: "Time format must be HH:mm",
      });
    }

    if (toMinutes(normalizedFrom) >= toMinutes(normalizedTo)) {
      return res.status(400).json({
        message: "From time must be earlier than to time",
      });
    }

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

    const daySlots = await Availability.find({
      doctor: doctor._id,
      day: normalizedDay,
    }).select("from to");

    if (
      hasOverlap({
        from: normalizedFrom,
        to: normalizedTo,
        slots: daySlots,
      })
    ) {
      return res.status(409).json({
        message: "This time range overlaps with an existing slot",
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

    const availability = await Availability.find({ doctor: doctor._id }).sort({
      day: 1,
      from: 1,
    });

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

    const availability = await Availability.find({ doctor: doctor._id }).sort({
      day: 1,
      from: 1,
    });

    res.json({ availability });
  } catch (error) {
    next(error);
  }
};

export const deleteAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      const error = new Error("Doctor profile not found");
      error.statusCode = 404;
      return next(error);
    }

    const deleted = await Availability.findOneAndDelete({
      _id: id,
      doctor: doctor._id,
    });

    if (!deleted) {
      return res.status(404).json({
        message: "Availability slot not found",
      });
    }

    return res.status(200).json({
      message: "Availability deleted successfully",
      availability: deleted,
    });
  } catch (error) {
    next(error);
  }
};
