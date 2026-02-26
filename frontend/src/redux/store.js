import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import doctorReducer from "./slices/doctorSlice.js";
import appointmentReducer from "./slices/appointmentSlice.js";
import adminReducer from "./slices/adminSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    doctors: doctorReducer,
    appointment: appointmentReducer,
    admin: adminReducer,
    // هنا هنضيف باقي الـ slices زي الدكاترة والمواعيد بعدين
  },
});
