import { Appointment } from "../../Database/Models/appointment.model.js";
import Doctor from "../../Database/Models/doctor.model.js";
// @desc    Book a new appointment (Patient only)
// @route   POST /appointments
// @access  Patient
export const bookAppointment = async (req, res, next) => {
  try {
    const patientId = req.user._id;
    const { doctorId, date, startTime, endTime } = req.body;

    // 1) Check doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      const error = new Error("Doctor not found");
      error.statusCode = 404;
      return next(error);
    }

    // 2) Prevent double booking
    const conflict = await Appointment.findOne({
      doctor: doctorId,
      date,
      startTime,
      status: { $in: ["pending", "confirmed"] },
    });

    if (conflict) {
      const error = new Error("Time slot already booked");
      error.statusCode = 400;
      return next(error);
    }

    // 3) Create appointment
    const appointment = await Appointment.create({
      patient: patientId,
      doctor: doctorId,
      date,
      startTime,
      endTime,
      status: "pending",
      createdBy: patientId,
    });

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my appointments (Patient or Doctor)
// @route   GET /appointments/my
// @access  Patient, Doctor
export const getMyAppointments = async (req, res, next) => {
  try {
    const user = req.user;

    let filter = {};

    if (user.role === "patient") {
      filter.patient = user._id;
    } else if (user.role === "doctor") {
      filter.doctor = user._id;
    }

    const appointments = await Appointment.find(filter)
      .populate("patient", "name email")
      .populate({
        path: "doctor",
        populate: { path: "user", select: "name email" },
      });

    res.json({ appointments });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel appointment (Patient only - owner)
// @route   PATCH /appointments/:id/cancel
// @access  Patient
export const cancelAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const patientId = req.user._id;

    const appointment = await Appointment.findOne({
      _id: id,
      patient: patientId,
    });

    if (!appointment) {
      const error = new Error("Appointment not found");
      error.statusCode = 404;
      return next(error);
    }

    appointment.status = "cancelled";
    await appointment.save();

    res.json({
      message: "Appointment cancelled successfully",
      appointment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update appointment status (Doctor only)
// @route   PATCH /appointments/:id/status
// @access  Doctor
export const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const doctorId = req.user._id;

    const allowedStatus = ["confirmed", "completed", "cancelled"];
    if (!allowedStatus.includes(status)) {
      const error = new Error("Invalid status value");
      error.statusCode = 400;
      return next(error);
    }

    const appointment = await Appointment.findOne({
      _id: id,
      doctor: doctorId,
    });

    if (!appointment) {
      const error = new Error("Appointment not found");
      error.statusCode = 404;
      return next(error);
    }

    appointment.status = status;
    await appointment.save();

    res.json({
      message: "Status updated successfully",
      appointment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: get all appointments
// @route   GET /appointments
// @access  Admin
export const getAllAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find()
      .populate("patient", "name email")
      .populate({
        path: "doctor",
        populate: { path: "user", select: "name email" },
      });

    res.json({ appointments });
  } catch (error) {
    next(error);
  }
};
