import Doctor from "../../Database/Models/doctor.model.js";
import Specialty from "../../Database/Models/specialty.model.js";
import mongoose from "mongoose";
import User from "../../Database/Models/user.model.js";
import { Availability } from "../../Database/Models/availability.model.js";
import { Appointment } from "../../Database/Models/appointment.model.js";
import { sendDoctorApprovalEmail } from "../../Utils/sendEmail.js";

export const createDoctorProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { specialtyId, specialty, bio, phone, fees, experienceYears } =
      req.body || {};
    const selectedSpecialtyId = specialtyId || specialty;

    if (!selectedSpecialtyId) {
      const error = new Error("specialtyId is required");
      error.statusCode = 400;
      return next(error);
    }

    const specialtyDoc = await Specialty.findById(selectedSpecialtyId);
    if (!specialtyDoc) {
      const error = new Error("Specialty not found");
      error.statusCode = 404;
      return next(error);
    }

    const existingProfile = await Doctor.findOne({ user: userId });
    if (existingProfile) {
      const error = new Error("Doctor profile already exists");
      error.statusCode = 400;
      return next(error);
    }

    const doctor = await Doctor.create({
      user: userId,
      specialty: selectedSpecialtyId,
      bio,
      phone,
      fees,
      experienceYears,
      status: "pending",
      isApproved: false,
    });

    res.status(201).json({
      message: "Doctor profile created successfully",
      doctor,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyDoctorProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const doctor = await Doctor.findOne({ user: userId })
      .populate("user", "name email role image phone address gender age")
      .populate("specialty", "name description");

    if (!doctor) {
      const error = new Error("Doctor profile not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({ doctor });
  } catch (error) {
    next(error);
  }
};

export const updateMyDoctorProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const {
      specialtyId,
      specialty,
      bio,
      phone,
      fees,
      experienceYears,
      name,
      email,
      image,
      address,
      gender,
      age,
    } = req.body || {};
    const selectedSpecialtyId = specialtyId || specialty;

    const doctor = await Doctor.findOne({ user: userId });
    if (!doctor) {
      const error = new Error("Doctor profile not found");
      error.statusCode = 404;
      return next(error);
    }

    if (selectedSpecialtyId !== undefined) {
      const specialtyDoc = await Specialty.findById(selectedSpecialtyId);
      if (!specialtyDoc) {
        const error = new Error("Specialty not found");
        error.statusCode = 404;
        return next(error);
      }
      doctor.specialty = selectedSpecialtyId;
    }

    if (bio !== undefined) doctor.bio = bio;
    if (phone !== undefined) doctor.phone = phone;
    if (fees !== undefined) doctor.fees = fees;
    if (experienceYears !== undefined) doctor.experienceYears = experienceYears;

    if (
      name !== undefined ||
      email !== undefined ||
      image !== undefined ||
      address !== undefined ||
      gender !== undefined ||
      age !== undefined ||
      phone !== undefined
    ) {
      const user = await User.findById(userId);
      if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        return next(error);
      }

      if (name !== undefined) user.name = name;
      if (email !== undefined) user.email = email;
      if (image !== undefined) user.image = image;
      if (address !== undefined) user.address = address;
      if (gender !== undefined) user.gender = gender;
      if (age !== undefined) user.age = age;
      if (phone !== undefined) user.phone = phone;

      await user.save();
    }

    await doctor.save();

    const updatedDoctor = await Doctor.findById(doctor._id)
      .populate("user", "name email role image phone address gender age")
      .populate("specialty", "name description");

    res.status(200).json({
      message: "Doctor profile updated successfully",
      doctor: updatedDoctor,
    });
  } catch (error) {
    if (error?.code === 11000 && error?.keyPattern?.email === 1) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    next(error);
  }
};

export const discoverDoctors = async (req, res, next) => {
  try {
    const { name, specialty, minRating, approved } = req.query;
    const filter = {};

    if (approved === "true") {
      filter.isApproved = true;
    } else if (approved === "false") {
      filter.isApproved = false;
    }

    if (minRating !== undefined) {
      const ratingValue = Number(minRating);
      if (Number.isNaN(ratingValue) || ratingValue < 0 || ratingValue > 5) {
        return res.status(400).json({
          message: "minRating must be a number between 0 and 5",
        });
      }
      filter.rating = { $gte: ratingValue };
    }

    if (specialty) {
      if (mongoose.Types.ObjectId.isValid(specialty)) {
        filter.specialty = specialty;
      } else {
        const specialties = await Specialty.find({
          name: { $regex: specialty, $options: "i" },
        }).select("_id");

        filter.specialty = {
          $in: specialties.map((item) => item._id),
        };
      }
    }

    let doctors = await Doctor.find(filter)
      .populate("user", "name email")
      .populate("specialty", "name description")
      .sort({ rating: -1, createdAt: -1 });

    if (name) {
      const keyword = name.toLowerCase();
      doctors = doctors.filter((doctor) =>
        doctor.user?.name?.toLowerCase().includes(keyword),
      );
    }

    res.status(200).json({
      message: "Doctors fetched successfully",
      filters: {
        name: name || null,
        specialty: specialty || null,
        minRating: minRating !== undefined ? Number(minRating) : null,
      },
      doctors,
    });
  } catch (error) {
    next(error);
  }
};

export const getPendingDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.find({
      $or: [
        { status: "pending" },
        { status: { $exists: false }, isApproved: false },
      ],
    })
      .populate("user", "name email")
      .populate("specialty", "name description");
    res.status(200).json(doctors);
  } catch (error) {
    next(error);
  }
};

export const approveDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate(
      "user",
      "name email",
    );

    if (!doctor) {
      const error = new Error("Doctor not found");
      error.statusCode = 404;
      return next(error);
    }

    const wasPending = doctor.status === "pending";

    doctor.isApproved = true;
    doctor.status = "approved";
    await doctor.save();

    if (wasPending && doctor.user?.email) {
      sendDoctorApprovalEmail({
        to: doctor.user.email,
        recipientName: doctor.user.name,
      }).catch((emailError) => {
        console.error("Failed to send doctor approval email:", emailError.message);
      });
    }

    res.status(200).json({ message: "Doctor approved", doctor });
  } catch (error) {
    next(error);
  }
};

export const rejectDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { isApproved: false, status: "rejected" },
      { new: true },
    );

    if (!doctor) {
      const error = new Error("Doctor not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({ message: "Doctor rejected", doctor });
  } catch (error) {
    next(error);
  }
};

export const deleteDoctorByAdmin = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate("user", "_id");

    if (!doctor) {
      const error = new Error("Doctor not found");
      error.statusCode = 404;
      return next(error);
    }

    if (doctor.user?._id) {
      await User.findOneAndDelete({ _id: doctor.user._id });
    } else {
      await Promise.all([
        Availability.deleteMany({ doctor: doctor._id }),
        Appointment.deleteMany({ doctor: doctor._id }),
      ]);
      await Doctor.findByIdAndDelete(doctor._id);
    }

    return res.status(200).json({
      message: "Doctor deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
