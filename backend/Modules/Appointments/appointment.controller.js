import { Appointment } from "../../Database/Models/appointment.model.js";
import Doctor from "../../Database/Models/doctor.model.js";
import { Patient } from "../../Database/Models/patient.model.js";
import { sendAppointmentNotificationEmail } from "../../Utils/sendEmail.js";

const isDuplicateSlotError = (error) => {
  return (
    error &&
    error.code === 11000 &&
    error.keyPattern &&
    error.keyPattern.doctor === 1 &&
    error.keyPattern.date === 1 &&
    error.keyPattern.startTime === 1
  );
};

const notifyAppointmentParties = async ({ appointmentId, action }) => {
  const appointment = await Appointment.findById(appointmentId)
    .populate({
      path: "patient",
      populate: { path: "user", select: "name email" },
    })
    .populate({
      path: "doctor",
      populate: { path: "user", select: "name email" },
    });

  if (!appointment) return;

  const patientEmail = appointment.patient?.user?.email;
  const patientName = appointment.patient?.user?.name;
  const doctorEmail = appointment.doctor?.user?.email;
  const doctorName = appointment.doctor?.user?.name;

  const emailJobs = [];

  if (patientEmail) {
    emailJobs.push(
      sendAppointmentNotificationEmail({
        to: patientEmail,
        recipientName: patientName,
        action,
        appointment,
      }),
    );
  }

  if (doctorEmail) {
    emailJobs.push(
      sendAppointmentNotificationEmail({
        to: doctorEmail,
        recipientName: doctorName,
        action,
        appointment,
      }),
    );
  }

  await Promise.allSettled(emailJobs);
};

export const bookAppointment = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { doctorId, date, startTime, endTime } = req.body;

    let doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      doctor = await Doctor.findOne({ user: doctorId });
    }
    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    const patient = await Patient.findOne({ user: userId });
    if (!patient) {
      return res.status(404).json({
        message: "Patient profile not found",
      });
    }

    const conflict = await Appointment.findOne({
      doctor: doctor._id,
      date,
      startTime,
      status: { $in: ["pending", "confirmed"] },
    });

    if (conflict) {
      return res.status(400).json({
        message: "Time slot already booked",
      });
    }

    const appointment = await Appointment.create({
      patient: patient._id,
      doctor: doctor._id,
      date,
      startTime,
      endTime,
      status: "pending",
      createdBy: userId,
    });

    notifyAppointmentParties({
      appointmentId: appointment._id,
      action: "booked",
    }).catch((notificationError) => {
      console.error(
        "Failed to send booking notification:",
        notificationError.message,
      );
    });

    return res.status(201).json({
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    if (isDuplicateSlotError(error)) {
      return res.status(409).json({
        message: "Time slot already booked",
      });
    }

    next(error);
  }
};

export const getMyAppointments = async (req, res, next) => {
  try {
    const user = req.user;
    let filter = {};

    if (user.role === "patient") {
      const patient = await Patient.findOne({ user: user._id });
      if (!patient) {
        return res.status(404).json({
          message: "Patient profile not found",
        });
      }
      filter.patient = patient._id;
    } else if (user.role === "doctor") {
      const doctor = await Doctor.findOne({ user: user._id });
      if (!doctor) {
        return res.status(404).json({
          message: "Doctor profile not found",
        });
      }
      filter.doctor = doctor._id;
    }

    const appointments = await Appointment.find(filter)
      .populate("patient", "name email")
      .populate({
        path: "doctor",
        populate: { path: "user", select: "name email" },
      });

    return res.status(200).json({
      message: "Appointments fetched successfully",
      appointments,
    });
  } catch (error) {
    next(error);
  }
};

export const getDoctorAppointmentsByView = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({
        message: "Doctor profile not found",
      });
    }

    const { view = "all" } = req.query;
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const filter = { doctor: doctor._id };

    if (view === "pending") {
      filter.status = "pending";
    } else if (view === "upcoming") {
      filter.status = { $in: ["pending", "confirmed"] };
      filter.date = { $gte: startOfToday };
    } else if (view === "past") {
      filter.$or = [
        { status: { $in: ["completed", "cancelled"] } },
        { date: { $lt: startOfToday } },
      ];
    }

    const appointments = await Appointment.find(filter)
      .sort({ date: 1, startTime: 1 })
      .populate({
        path: "patient",
        populate: { path: "user", select: "name email" },
      })
      .populate({
        path: "doctor",
        populate: { path: "user", select: "name email" },
      });

    return res.status(200).json({
      message: "Doctor appointments fetched successfully",
      view,
      appointments,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) {
      return res.status(404).json({
        message: "Patient profile not found",
      });
    }

    const appointment = await Appointment.findOne({
      _id: id,
      patient: patient._id,
    });

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    appointment.status = "cancelled";
    await appointment.save();

    notifyAppointmentParties({
      appointmentId: appointment._id,
      action: "cancelled",
    }).catch((notificationError) => {
      console.error(
        "Failed to send cancellation notification:",
        notificationError.message,
      );
    });

    return res.status(200).json({
      message: "Appointment cancelled successfully",
      appointment,
    });
  } catch (error) {
    next(error);
  }
};

export const rescheduleAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date, startTime, endTime } = req.body;

    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) {
      return res.status(404).json({
        message: "Patient profile not found",
      });
    }

    const appointment = await Appointment.findOne({
      _id: id,
      patient: patient._id,
    });

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    if (!["pending", "confirmed"].includes(appointment.status)) {
      return res.status(400).json({
        message: "Only pending or confirmed appointments can be rescheduled",
      });
    }

    const conflict = await Appointment.findOne({
      _id: { $ne: appointment._id },
      doctor: appointment.doctor,
      date,
      startTime,
      status: { $in: ["pending", "confirmed"] },
    });

    if (conflict) {
      return res.status(400).json({
        message: "Time slot already booked",
      });
    }

    appointment.date = date;
    appointment.startTime = startTime;
    appointment.endTime = endTime;
    appointment.status = "pending";

    await appointment.save();

    notifyAppointmentParties({
      appointmentId: appointment._id,
      action: "rescheduled",
    }).catch((notificationError) => {
      console.error(
        "Failed to send reschedule notification:",
        notificationError.message,
      );
    });

    return res.status(200).json({
      message: "Appointment rescheduled successfully",
      appointment,
    });
  } catch (error) {
    if (isDuplicateSlotError(error)) {
      return res.status(409).json({
        message: "Time slot already booked",
      });
    }

    next(error);
  }
};

export const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({
        message: "Doctor profile not found",
      });
    }

    const allowedStatus = ["confirmed", "completed", "cancelled"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status value",
      });
    }

    const appointment = await Appointment.findOne({
      _id: id,
      doctor: doctor._id,
    });

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    appointment.status = status;
    await appointment.save();

    notifyAppointmentParties({
      appointmentId: appointment._id,
      action: `updated to ${status}`,
    }).catch((notificationError) => {
      console.error(
        "Failed to send status notification:",
        notificationError.message,
      );
    });

    return res.status(200).json({
      message: "Status updated successfully",
      appointment,
    });
  } catch (error) {
    next(error);
  }
};

export const addConsultationNotes = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { consultationNotes } = req.body;

    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({
        message: "Doctor profile not found",
      });
    }

    const appointment = await Appointment.findOne({
      _id: id,
      doctor: doctor._id,
    });

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    if (appointment.status !== "completed") {
      return res.status(400).json({
        message:
          "Consultation notes can only be added to completed appointments",
      });
    }

    appointment.consultationNotes = consultationNotes;
    await appointment.save();

    return res.status(200).json({
      message: "Consultation notes updated successfully",
      appointment,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find()
      .populate("patient", "name email")
      .populate({
        path: "doctor",
        populate: { path: "user", select: "name email" },
      });

    return res.status(200).json({
      message: "All appointments fetched successfully",
      appointments,
    });
  } catch (error) {
    next(error);
  }
};
