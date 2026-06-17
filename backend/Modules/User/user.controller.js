import User from "../../Database/Models/user.model.js";
import { Patient } from "../../Database/Models/patient.model.js";
import { Appointment } from "../../Database/Models/appointment.model.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.json({ users });
  } catch (error) {
    next(error);
  }
};

export const getMyProfile = async (req, res, next) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    next(error);
  }
};

export const updateMyProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { name, email, phone, address, gender, age, image } = req.body || {};

    const user = await User.findById(userId);
    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 404;
      return next(err);
    }

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (gender !== undefined) user.gender = gender;
    if (age !== undefined) user.age = age;
    if (image !== undefined) user.image = image;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        gender: user.gender,
        age: user.age,
        image: user.image,
      },
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

export const getMyUserAppointments = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) {
      return res.status(200).json({ data: [] });
    }

    const appointments = await Appointment.find({ patient: patient._id })
      .sort({ date: -1, startTime: -1 })
      .populate({
        path: "doctor",
        populate: { path: "user", select: "name email image" },
      });

    return res.status(200).json({ data: appointments });
  } catch (error) {
    next(error);
  }
};

export const cancelMyUserAppointment = async (req, res, next) => {
  try {
    const { appointmentId } = req.body || {};

    if (!appointmentId) {
      const err = new Error("appointmentId is required");
      err.statusCode = 400;
      return next(err);
    }

    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) {
      const err = new Error("Patient profile not found");
      err.statusCode = 404;
      return next(err);
    }

    const appointment = await Appointment.findOne({
      _id: appointmentId,
      patient: patient._id,
    });

    if (!appointment) {
      const err = new Error("Appointment not found");
      err.statusCode = 404;
      return next(err);
    }

    appointment.status = "cancelled";
    await appointment.save();

    return res.status(200).json({
      message: "Appointment cancelled successfully",
      appointment,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Block or Unblock user
export const toggleBlockUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 404;
      return next(err);
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      message: user.isActive
        ? "User unblocked successfully"
        : "User blocked successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Delete user
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 404;
      return next(err);
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};
