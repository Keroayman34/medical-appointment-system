import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

export const config = {
  PORT: process.env.PORT || 5000,
  DB_URL: process.env.DB_URL || "mongodb://127.0.0.1:27017/MedicalDB",
  JWT_SECRET: process.env.JWT_SECRET || "SUPER_SECRET_KEY_CHANGE_ME",
};
