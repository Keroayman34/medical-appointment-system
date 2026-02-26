import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

export const config = {
  PORT: process.env.PORT || 5000,
  DB_URL: process.env.DB_URL || "mongodb://127.0.0.1:27017/MedicalDB",
  JWT_SECRET: process.env.JWT_SECRET || "SUPER_SECRET_KEY_CHANGE_ME",
  EMAIL_HOST: process.env.EMAIL_HOST || "",
  EMAIL_PORT: Number(process.env.EMAIL_PORT || 587),
  EMAIL_SECURE: process.env.EMAIL_SECURE === "true",
  EMAIL_USER: process.env.EMAIL_USER || "",
  EMAIL_PASS: process.env.EMAIL_PASS || "",
  EMAIL_FROM: process.env.EMAIL_FROM || "",
  ENABLE_EMAIL_NOTIFICATIONS: process.env.ENABLE_EMAIL_NOTIFICATIONS === "true",
};
