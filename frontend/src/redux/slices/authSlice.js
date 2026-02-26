import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1/auth';
const USER_API = 'http://localhost:5000/api/v1/user'; // أضفنا مسار عمليات المستخدم

// 1. تسجيل الدخول
export const loginUser = createAsyncThunk('auth/login', async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/login`, userData);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user)); 
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Login failed");
    }
});

// 2. إنشاء حساب جديد
export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/signup`, userData);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Registration failed");
    }
});

// 3. تحديث بيانات البروفايل الشخصي
export const updateProfile = createAsyncThunk('auth/updateProfile', async (formData, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const config = { headers: { Authorization: `Bearer ${auth.token}` } };
        const response = await axios.patch(`${API_URL}/update-me`, formData, config);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data.user;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Update failed");
    }
});

// --- إضافات هامة لربط صفحة المواعيد (Appointment.jsx) ---

// 4. جلب مواعيد المريض
export const fetchMyAppointments = createAsyncThunk('auth/fetchAppointments', async (_, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const config = { headers: { Authorization: `Bearer ${auth.token}` } };
        const response = await axios.get(`${USER_API}/appointments`, config);
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch");
    }
});

// 5. إلغاء موعد من طرف المريض
export const cancelAppointment = createAsyncThunk('auth/cancelAppointment', async (appointmentId, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const config = { headers: { Authorization: `Bearer ${auth.token}` } };
        await axios.post(`${USER_API}/cancel-appointment`, { appointmentId }, config);
        return appointmentId;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Cancel failed");
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('token') || null,
        appointments: [], // مكان تخزين مواعيد المريض
        loading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.appointments = [];
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.user = action.payload.user;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            // جلب المواعيد
            .addCase(fetchMyAppointments.fulfilled, (state, action) => {
                state.appointments = action.payload;
            })
            // إلغاء الموعد وتحديث الـ UI فوراً
            .addCase(cancelAppointment.fulfilled, (state, action) => {
                state.appointments = state.appointments.map(item => 
                    item._id === action.payload ? { ...item, cancelled: true } : item
                );
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;