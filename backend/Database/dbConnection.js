import mongoose from "mongoose";
import { config } from "../Config/env.js";

export const dbConnection = () => {
  return mongoose
    .connect(config.DB_URL)
    .then(() => {
      console.log("Database connected");
    })
    .catch((err) => {
      console.error("DB connection error:", err);
    });
};
