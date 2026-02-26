import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const FRIENDLY_NETWORK_ERROR =
  "Cannot reach server. Make sure backend is running on port 5000.";

const normalizeValidationMessage = (message = "") => {
  const text = String(message).trim();

  if (/"email"\s+is\s+required/i.test(text)) return "Email is required.";
  if (/"password"\s+is\s+required/i.test(text)) return "Password is required.";
  if (/"name"\s+is\s+required/i.test(text)) return "Name is required.";
  if (/"specialtyId"\s+is\s+required/i.test(text)) return "Please select a specialty.";
  if (/"email"\s+must\s+be\s+a\s+valid\s+email/i.test(text)) {
    return "Please enter a valid email address.";
  }
  if (/"password".*at\s+least\s+6\s+characters/i.test(text)) {
    return "Password must be at least 6 characters.";
  }
  if (/"age"/i.test(text) && /must be (greater|less)/i.test(text)) {
    return "Please enter a valid age.";
  }

  return text.replace(/"/g, "");
};

const getAuthErrorMessage = (error, mode) => {
  if (error.code === "ECONNABORTED") {
    return "Request timed out. Please try again.";
  }

  if (!error.response) {
    return FRIENDLY_NETWORK_ERROR;
  }

  const status = error.response?.status;
  const message = error.response?.data?.message;
  const details = error.response?.data?.details;

  if (Array.isArray(details) && details.length) {
    return details.map(normalizeValidationMessage).join("\n");
  }

  if (status === 401) {
    return "Invalid email or password.";
  }

  if (status === 409 || /email already/i.test(message || "")) {
    return "This email is already registered.";
  }

  if (mode === "login" && /invalid email or password/i.test(message || "")) {
    return "Invalid email or password.";
  }

  if (mode === "register" && /specialty not found/i.test(message || "")) {
    return "Selected specialty is not valid.";
  }

  if (typeof message === "string" && message.trim()) {
    return normalizeValidationMessage(message);
  }

  return mode === "login"
    ? "Login failed. Please check your credentials."
    : "Registration failed. Please check your data and try again.";
};

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
      return rejectWithValue(getAuthErrorMessage(error, "login"));
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
      return rejectWithValue(getAuthErrorMessage(error, "register"));
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