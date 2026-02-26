import Specialty from "../../Database/Models/specialty.model.js";


export const createSpecialty = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const existing = await Specialty.findOne({ name });
    if (existing) {
      const error = new Error("Specialty already exists");
      error.statusCode = 400;
      return next(error);
    }

    const specialty = await Specialty.create({
      name,
      description,
    });

    res.status(201).json({
      message: "Specialty created successfully",
      specialty,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllSpecialties = async (req, res, next) => {
  try {
    const specialties = await Specialty.find({ isActive: true });
    res.json({ specialties });
  } catch (error) {
    next(error);
  }
};

export const updateSpecialty = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, isActive } = req.body;

    const specialty = await Specialty.findById(id);
    if (!specialty) {
      const error = new Error("Specialty not found");
      error.statusCode = 404;
      return next(error);
    }

    if (name !== undefined) specialty.name = name;
    if (description !== undefined) specialty.description = description;
    if (isActive !== undefined) specialty.isActive = isActive;

    await specialty.save();

    res.json({
      message: "Specialty updated successfully",
      specialty,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSpecialty = async (req, res, next) => {
  try {
    const { id } = req.params;

    const specialty = await Specialty.findById(id);
    if (!specialty) {
      const error = new Error("Specialty not found");
      error.statusCode = 404;
      return next(error);
    }

    await Specialty.findByIdAndDelete(id);

    res.json({ message: "Specialty deleted successfully" });
  } catch (error) {
    next(error);
  }
};
