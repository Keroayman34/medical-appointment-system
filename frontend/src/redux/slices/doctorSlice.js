import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

// استخدام المسار النسبي ليعمل مع Vite Proxy
const API_BASE_URL = "/api/doctors";

// 1. جلب كل الدكاترة (للمرضى)
export const fetchDoctors = createAsyncThunk(
  "doctor/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/discover`);
      return response.data.doctors;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching doctors",
      );
    }
  },
);

// 2. جلب بيانات دكتور واحد بالـ ID
export const fetchDoctorById = createAsyncThunk(
  "doctor/fetchById",
  async (docId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/discover`);
      const doctors = response.data.doctors || [];
      const doctor = doctors.find(
        (item) => item._id === docId || item.user?._id === docId,
      );

      if (!doctor) {
        return rejectWithValue("Doctor not found");
      }

      try {
        const availabilityResponse = await axios.get(
          `/api/availability/${doctor._id}`,
        );
        return {
          ...doctor,
          availabilities: availabilityResponse.data?.availability || [],
        };
      } catch {
        return {
          ...doctor,
          availabilities: [],
        };
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching doctor details",
      );
    }
  },
);

// 3. جلب مواعيد الدكتور المسجل دخول (لوحة تحكم الطبيب)
export const fetchDoctorAppointments = createAsyncThunk(
  "doctor/fetchAppointments",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const config = { headers: { Authorization: `Bearer ${auth.token}` } };
      const response = await axios.get(`/api/appointments/doctor`, config);
      return response.data.appointments;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching appointments",
      );
    }
  },
);

// 4. إتمام الموعد (تغيير الحالة لمكتمل)
export const completeAppointment = createAsyncThunk(
  "doctor/completeAppointment",
  async (appointmentId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const config = { headers: { Authorization: `Bearer ${auth.token}` } };
      await axios.patch(
        `/api/appointments/${appointmentId}/status`,
        { status: "completed" },
        config,
      );
      return appointmentId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error completing appointment",
      );
    }
  },
);

// 5. إلغاء موعد (من طرف الدكتور)
export const cancelDoctorAppointment = createAsyncThunk(
  "doctor/cancelAppointment",
  async (appointmentId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const config = { headers: { Authorization: `Bearer ${auth.token}` } };
      await axios.patch(
        `/api/appointments/${appointmentId}/status`,
        { status: "cancelled" },
        config,
      );
      return appointmentId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error cancelling appointment",
      );
    }
  },
);

// 6. جلب بروفايل الدكتور الحالي
export const getDoctorProfile = createAsyncThunk(
  "doctor/getProfile",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const config = { headers: { Authorization: `Bearer ${auth.token}` } };
      const { data } = await axios.get(`${API_BASE_URL}/me`, config);
      return data.doctor;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching profile",
      );
    }
  },
);

// 7. تحديث البروفايل (للدكتور)
export const updateDoctorProfile = createAsyncThunk(
  "doctor/updateProfile",
  async (profileData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const config = { headers: { Authorization: `Bearer ${auth.token}` } };
      const { data } = await axios.patch(
        `${API_BASE_URL}/me`,
        profileData,
        config,
      );
      toast.success("Profile Updated!");
      return data.doctor;
    } catch (error) {
      const msg = error.response?.data?.message || "Update failed";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  },
);

// 8. إنشاء بروفايل الدكتور لو غير موجود
export const createDoctorProfile = createAsyncThunk(
  "doctor/createProfile",
  async (profileData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const config = { headers: { Authorization: `Bearer ${auth.token}` } };
      const { data } = await axios.post(`${API_BASE_URL}`, profileData, config);
      toast.success("Doctor profile created!");
      return data.doctor;
    } catch (error) {
      const msg =
        error.response?.data?.details?.[0] ||
        error.response?.data?.message ||
        "Create profile failed";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  },
);

const doctorSlice = createSlice({
  name: "doctor",
  initialState: {
    doctors: [],
    selectedDoctor: null,
    appointments: [],
    profile: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearDoctorState: (state) => {
      state.doctors = [];
      state.selectedDoctor = null;
      state.appointments = [];
      state.profile = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.doctors = action.payload;
        state.loading = false;
      })
      .addCase(fetchDoctorById.fulfilled, (state, action) => {
        state.selectedDoctor = action.payload;
        state.loading = false;
      })
      .addCase(fetchDoctorAppointments.fulfilled, (state, action) => {
        state.appointments = action.payload;
        state.loading = false;
      })
      .addCase(completeAppointment.fulfilled, (state, action) => {
        state.appointments = state.appointments.map((app) =>
          app._id === action.payload ? { ...app, isCompleted: true } : app,
        );
        toast.success("Appointment Completed");
      })
      .addCase(cancelDoctorAppointment.fulfilled, (state, action) => {
        state.appointments = state.appointments.map((app) =>
          app._id === action.payload ? { ...app, cancelled: true } : app,
        );
        toast.success("Appointment Cancelled");
      })
      .addCase(getDoctorProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(createDoctorProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(updateDoctorProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
      })
      // التعامل الموحد مع حالات التحميل والرفض
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
          state.error = action.payload || "An error occurred";
        },
      );
  },
});

export const { clearDoctorState } = doctorSlice.actions;
export default doctorSlice.reducer;
