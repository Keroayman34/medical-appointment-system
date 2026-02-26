import { Patient } from "../../Database/Models/patient.model.js";
export const createPatientProfile = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user._id;
    const { age, gender, phone } = req.body;

    const existingProfile = await Patient.findOne({ user: userId });
    if (existingProfile) {
      const error = new Error("Patient profile already exists");
      error.statusCode = 400;
      return next(error);
    }

    const patient = await Patient.create({
      user: userId,
      age,
      gender,
      phone,
    });

    res.status(201).json({
      message: "Patient profile created successfully",
      patient,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyPatientProfile = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user._id;

    const patient = await Patient.findOne({ user: userId }).populate(
      "user",
      "name email role",
    );

    if (!patient) {
      const error = new Error("Patient profile not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      patient,
    });
  } catch (error) {
    next(error); 
  }
};

export const updateMyPatientProfile = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user._id;
    const { age, gender, phone, medicalHistory } = req.body;

    const patient = await Patient.findOne({ user: userId });

    if (!patient) {
      const error = new Error("Patient profile not found");
      error.statusCode = 404;
      return next(error);
    }

    if (age !== undefined) patient.age = age;
    if (gender !== undefined) patient.gender = gender;
    if (phone !== undefined) patient.phone = phone;
    if (medicalHistory !== undefined) patient.medicalHistory = medicalHistory;

    await patient.save();

    const updatedPatient = await Patient.findById(patient._id).populate(
      "user",
      "name email role",
    );

    res.status(200).json({
      message: "Patient profile updated successfully",
      patient: updatedPatient,
    });
  } catch (error) {
    next(error);
  }
};
