import Doctor from "../../Database/Models/doctor.model.js";
import User from "../../Database/Models/user.model.js";
import Specialty from "../../Database/Models/specialty.model.js";
import { Patient } from "../../Database/Models/patient.model.js";
import { Appointment } from "../../Database/Models/appointment.model.js";
import { ClinicSettings } from "../../Database/Models/clinicSettings.model.js";

const withDoctorPrefix = (name) => {
  const cleanName = String(name || "").trim();
  if (!cleanName) return cleanName;
  if (/^(dr\.?|doctor)\s+/i.test(cleanName)) return cleanName;
  return `Dr. ${cleanName}`;
};

const parseImageFromRequest = (req) => {
  if (typeof req.body?.image === "string" && req.body.image.trim()) {
    return req.body.image.trim();
  }

  if (req.file?.buffer && req.file?.mimetype) {
    const base64 = req.file.buffer.toString("base64");
    return `data:${req.file.mimetype};base64,${base64}`;
  }

  return "";
};

export const addDoctorByAdmin = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      specialtyId,
      about,
      bio,
      phone,
      fees,
      experience,
      experienceYears,
      address,
    } = req.body || {};

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "name, email and password are required" });
    }

    let specialty = null;

    if (specialtyId) {
      specialty = await Specialty.findById(specialtyId);
    } else if (speciality) {
      specialty = await Specialty.findOne({
        name: { $regex: `^${String(speciality).trim()}$`, $options: "i" },
      });

      if (!specialty) {
        specialty = await Specialty.create({ name: String(speciality).trim() });
      }
    }

    if (!specialty) {
      return res
        .status(400)
        .json({ message: "specialtyId or speciality is required" });
    }

    const existingUser = await User.findOne({
      email: String(email).toLowerCase(),
    });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const user = await User.create({
      name: withDoctorPrefix(name),
      email,
      password,
      role: "doctor",
      phone: phone || "",
      address: address || "",
      image: parseImageFromRequest(req),
    });

    try {
      const doctor = await Doctor.create({
        user: user._id,
        specialty: specialty._id,
        bio: about || bio || "",
        phone: phone || "",
        fees: Number.isFinite(Number(fees)) ? Number(fees) : 0,
        experienceYears: Number.isFinite(Number(experienceYears))
          ? Number(experienceYears)
          : Number.isFinite(Number(experience))
            ? Number(experience)
            : 0,
        status: "approved",
        isApproved: true,
        available: true,
      });

      const populatedDoctor = await Doctor.findById(doctor._id)
        .populate("user", "name email role image phone address")
        .populate("specialty", "name description");

      return res.status(201).json({
        message: "Doctor created successfully",
        doctor: populatedDoctor,
      });
    } catch (profileError) {
      await User.findByIdAndDelete(user._id);
      throw profileError;
    }
  } catch (error) {
    next(error);
  }
};

export const getAllDoctorsForAdmin = async (req, res, next) => {
  try {
    const doctors = await Doctor.find()
      .populate("user", "name email role isActive image phone address")
      .populate("specialty", "name description")
      .sort({ createdAt: -1 });

    return res.status(200).json({ data: doctors });
  } catch (error) {
    next(error);
  }
};

export const changeDoctorAvailabilityByAdmin = async (req, res, next) => {
  try {
    const { docId } = req.body || {};

    if (!docId) {
      return res.status(400).json({ message: "docId is required" });
    }

    const doctor = await Doctor.findById(docId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    doctor.available = !doctor.available;
    await doctor.save();

    return res.status(200).json({
      message: "Doctor availability toggled successfully",
      doctor,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminDashboard = async (req, res, next) => {
  try {
    const [
      usersCount,
      doctorsCount,
      patientsCount,
      specialtiesCount,
      appointmentsCount,
      pendingAppointments,
      confirmedAppointments,
      completedAppointments,
      cancelledAppointments,
      pendingDoctors,
      blockedUsers,
      latestAppointments,
    ] = await Promise.all([
      User.countDocuments(),
      Doctor.countDocuments(),
      Patient.countDocuments(),
      Specialty.countDocuments(),
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: "pending" }),
      Appointment.countDocuments({ status: "confirmed" }),
      Appointment.countDocuments({ status: "completed" }),
      Appointment.countDocuments({ status: "cancelled" }),
      Doctor.countDocuments({ isApproved: false }),
      User.countDocuments({ isActive: false }),
      Appointment.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate({
          path: "doctor",
          populate: { path: "user", select: "name email" },
        })
        .populate({
          path: "patient",
          populate: { path: "user", select: "name email" },
        }),
    ]);

    return res.status(200).json({
      data: {
        totals: {
          users: usersCount,
          doctors: doctorsCount,
          patients: patientsCount,
          specialties: specialtiesCount,
          appointments: appointmentsCount,
        },
        appointments: {
          pending: pendingAppointments,
          confirmed: confirmedAppointments,
          completed: completedAppointments,
          cancelled: cancelledAppointments,
        },
        moderation: {
          pendingDoctors,
          blockedUsers,
        },
        latestAppointments,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getClinicSettings = async (req, res, next) => {
  try {
    let settings = await ClinicSettings.findOne();

    if (!settings) {
      settings = await ClinicSettings.create({});
    }

    return res.status(200).json({ settings });
  } catch (error) {
    next(error);
  }
};

export const upsertClinicSettings = async (req, res, next) => {
  try {
    const updates = req.body || {};

    const settings = await ClinicSettings.findOneAndUpdate(
      {},
      { $set: updates },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    return res.status(200).json({
      message: "Clinic settings updated successfully",
      settings,
    });
  } catch (error) {
    next(error);
  }
};

export const resetClinicSettings = async (req, res, next) => {
  try {
    await ClinicSettings.deleteMany({});
    const settings = await ClinicSettings.create({});

    return res.status(200).json({
      message: "Clinic settings reset successfully",
      settings,
    });
  } catch (error) {
    next(error);
  }
};
