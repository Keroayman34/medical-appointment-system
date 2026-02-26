import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const FRIENDLY_NETWORK_ERROR =
  "Cannot reach server. Make sure backend is running on port 5000.";

// استخدام المسارات النسبية المتوافقة مع الـ Proxy
const API_URL = "/api/auth";
const USER_API = "/api/users";

// 1. تسجيل الدخول
export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/login`, userData, {
        timeout: 15000,
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      if (error.code === "ECONNABORTED") return rejectWithValue("Request timed out.");
      if (!error.response) return rejectWithValue(FRIENDLY_NETWORK_ERROR);
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  },
);

// 2. إنشاء حساب جديد
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData, {
        timeout: 15000,
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      if (error.code === "ECONNABORTED") return rejectWithValue("Request timed out.");
      if (!error.response) return rejectWithValue(FRIENDLY_NETWORK_ERROR);
      return rejectWithValue(error.response?.data?.message || "Registration failed");
    }
  },
);

// 3. تحديث بيانات البروفايل الشخصي
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (formData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const config = { headers: { Authorization: `Bearer ${auth.token}` } };
      const response = await axios.patch(`${USER_API}/me`, formData, config);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Update failed");
    }
  },
);

// 4. جلب مواعيد المريض
export const fetchMyAppointments = createAsyncThunk(
  "auth/fetchAppointments",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const config = { headers: { Authorization: `Bearer ${auth.token}` } };
      const response = await axios.get(`${USER_API}/appointments`, config);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch");
    }
  },
);

// 5. إلغاء موعد
export const cancelAppointment = createAsyncThunk(
  "auth/cancelAppointment",
  async (appointmentId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const config = { headers: { Authorization: `Bearer ${auth.token}` } };
      await axios.post(`${USER_API}/cancel-appointment`, { appointmentId }, config);
      return appointmentId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Cancel failed");
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    appointments: [],
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.appointments = [];
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    // دالة تنظيف الخطأ ضرورية لمسح الرسائل القديمة من الإشعارات
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchMyAppointments.fulfilled, (state, action) => {
        state.appointments = action.payload;
        state.loading = false;
      })
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        state.appointments = state.appointments.map((item) =>
          item._id === action.payload ? { ...item, cancelled: true } : item,
        );
      })
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        },
      );
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;