import mongoose from "mongoose";

/**
 * This function connects the application to MongoDB using Mongoose.
 * It logs a success message if the connection is successful
 * and logs the error if the connection fails.
 */
export const dbConnection = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/MedicalDB");
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1); // Stop the app if database connection fails
  }
};
