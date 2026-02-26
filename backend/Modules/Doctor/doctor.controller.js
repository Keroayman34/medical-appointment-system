import Doctor from "../../Database/Models/doctor.model.js";
import Specialty from "../../Database/Models/specialty.model.js";
import mongoose from "mongoose";

export const createDoctorProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { specialtyId, bio, phone, fees, experienceYears } = req.body;

    const specialty = await Specialty.findById(specialtyId);
    if (!specialty) {
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
      specialty: specialtyId,
      bio,
      phone,
      fees,
      experienceYears,
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
      .populate("user", "name email role")
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
    const { specialtyId, bio, phone, fees, experienceYears } = req.body;

    const doctor = await Doctor.findOne({ user: userId });
    if (!doctor) {
      const error = new Error("Doctor profile not found");
      error.statusCode = 404;
      return next(error);
    }

    if (specialtyId !== undefined) {
      const specialty = await Specialty.findById(specialtyId);
      if (!specialty) {
        const error = new Error("Specialty not found");
        error.statusCode = 404;
        return next(error);
      }
      doctor.specialty = specialtyId;
    }

    if (bio !== undefined) doctor.bio = bio;
    if (phone !== undefined) doctor.phone = phone;
    if (fees !== undefined) doctor.fees = fees;
    if (experienceYears !== undefined) doctor.experienceYears = experienceYears;

    await doctor.save();

    const updatedDoctor = await Doctor.findById(doctor._id)
      .populate("user", "name email role")
      .populate("specialty", "name description");

    res.status(200).json({
      message: "Doctor profile updated successfully",
      doctor: updatedDoctor,
    });
  } catch (error) {
    next(error);
  }
};

export const discoverDoctors = async (req, res, next) => {
  try {
    const { name, specialty, minRating } = req.query;
    const filter = { isApproved: true };

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
    const doctors = await Doctor.find({ isApproved: false }).populate(
      "user",
      "name email",
    );
    res.status(200).json(doctors);
  } catch (error) {
    next(error);
  }
};

export const approveDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true },
    );

    if (!doctor) {
      const error = new Error("Doctor not found");
      error.statusCode = 404;
      return next(error);
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
      { isApproved: false },
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
