import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import doctorReducer from './slices/doctorSlice.js';
import appointmentReducer from './slices/appointmentSlice.js'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        doctors: doctorReducer,
        appointment: appointmentReducer
        // هنا هنضيف باقي الـ slices زي الدكاترة والمواعيد بعدين
    },
});