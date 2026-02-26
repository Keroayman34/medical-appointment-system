import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

<<<<<<< HEAD
const API_URL = "http://localhost:5000/api/auth";
const USER_API = "http://localhost:5000/api/users";
=======
// التعديل 1: استخدام المسارات النسبية (Relative Paths) لتعمل مع الـ Proxy
const API_URL = '/api/auth';
const USER_API = '/api/users'; // الباك إيند عندك بيستخدم /api/users مش /api/v1/user
>>>>>>> 0f1442d (edit login & register pages)

// 1. تسجيل الدخول
export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/login`, userData);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      const serverMessage =
        error.response?.data?.details?.[0] || error.response?.data?.message;
      return rejectWithValue(serverMessage || "Login failed");
    }
  },
);

<<<<<<< HEAD
// 2. إنشاء حساب جديد
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      return response.data;
=======
// 2. إنشاء حساب جديد (Signup)
export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
    try {
        // الـ Proxy هيحول ده لـ http://localhost:5000/api/auth/signup
        const response = await axios.post(`${API_URL}/register`, userData);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data;
>>>>>>> 0f1442d (edit login & register pages)
    } catch (error) {
      const serverMessage =
        error.response?.data?.details?.[0] || error.response?.data?.message;
      return rejectWithValue(serverMessage || "Registration failed");
    }
  },
);

// 3. تحديث بيانات البروفايل الشخصي
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (formData, { getState, rejectWithValue }) => {
    try {
<<<<<<< HEAD
      const { auth } = getState();
      const config = { headers: { Authorization: `Bearer ${auth.token}` } };
      const response = await axios.patch(`${USER_API}/me`, formData, config);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      return response.data.user;
=======
        const { auth } = getState();
        const config = { headers: { Authorization: `Bearer ${auth.token}` } };
        // الباك إيند الثابت غالباً بيستخدم /update-profile أو /update-me
        const response = await axios.patch(`${API_URL}/update-me`, formData, config);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data.user;
>>>>>>> 0f1442d (edit login & register pages)
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
<<<<<<< HEAD
      const { auth } = getState();
      const config = { headers: { Authorization: `Bearer ${auth.token}` } };
      const response = await axios.get(`${USER_API}/appointments`, config);
      return response.data.data;
=======
        const { auth } = getState();
        const config = { headers: { Authorization: `Bearer ${auth.token}` } };
        // تأكد من المسار في الباك إيند (غالباً /api/users/appointments)
        const response = await axios.get(`${USER_API}/appointments`, config);
        return response.data.data;
>>>>>>> 0f1442d (edit login & register pages)
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch",
      );
    }
  },
);

// 5. إلغاء موعد من طرف المريض
export const cancelAppointment = createAsyncThunk(
  "auth/cancelAppointment",
  async (appointmentId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const config = { headers: { Authorization: `Bearer ${auth.token}` } };
      await axios.post(
        `${USER_API}/cancel-appointment`,
        { appointmentId },
        config,
      );
      return appointmentId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Cancel failed");
    }
  },
);

const authSlice = createSlice({
<<<<<<< HEAD
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    appointments: [], // مكان تخزين مواعيد المريض
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.appointments = [];
      state.error = null;
      state.loading = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
=======
    name: 'auth',
    initialState: {
        user: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('token') || null,
        appointments: [], 
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
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.user = action.payload.user;
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
                state.appointments = state.appointments.map(item => 
                    item._id === action.payload ? { ...item, cancelled: true } : item
                );
            })
            // التعامل مع الـ Loading بشكل موحد
            .addMatcher(action => action.type.endsWith('/pending'), (state) => { state.loading = true; })
            .addMatcher(action => action.type.endsWith('/rejected'), (state, action) => { 
                state.loading = false; 
                state.error = action.payload;
            });
>>>>>>> 0f1442d (edit login & register pages)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Update failed";
      })
      // جلب المواعيد
      .addCase(fetchMyAppointments.fulfilled, (state, action) => {
        state.appointments = action.payload;
      })
      // إلغاء الموعد وتحديث الـ UI فوراً
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        state.appointments = state.appointments.map((item) =>
          item._id === action.payload ? { ...item, cancelled: true } : item,
        );
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
