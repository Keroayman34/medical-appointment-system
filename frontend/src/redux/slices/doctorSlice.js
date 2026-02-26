import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

<<<<<<< HEAD
const API_BASE_URL = "http://localhost:5000/api/v1/doctor";
const DISCOVER_DOCTORS_URL = "http://localhost:5000/api/doctors/discover";

export const fetchDoctors = createAsyncThunk(
  "doctor/fetchDoctors",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const config = auth?.token
        ? { headers: { Authorization: `Bearer ${auth.token}` } }
        : {};
      const { data } = await axios.get(DISCOVER_DOCTORS_URL, config);
      return data?.doctors || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching doctors",
      );
    }
  },
);

export const fetchDoctorById = createAsyncThunk(
  "doctor/fetchDoctorById",
  async (doctorId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const config = auth?.token
        ? { headers: { Authorization: `Bearer ${auth.token}` } }
        : {};
      const { data } = await axios.get(DISCOVER_DOCTORS_URL, config);
      const doctor = (data?.doctors || []).find(
        (item) => item._id === doctorId,
      );

      if (!doctor) {
        return rejectWithValue("Doctor not found");
      }

      return doctor;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching doctor details",
      );
    }
  },
);

// 1. جلب مواعيد الدكتور
export const fetchDoctorAppointments = createAsyncThunk(
  "doctor/fetchAppointments",
  async (_, { getState, rejectWithValue }) => {
=======
// التعديل الجوهري: نستخدم المسار النسبي فقط عشان الـ Proxy يلقطه
// شيلنا http://localhost:5000 خالص
const API_BASE_URL = '/api/doctors'; 

// 1. جلب كل الدكاترة (للمريض)
export const fetchDoctors = createAsyncThunk('doctor/fetchAll', async (_, { rejectWithValue }) => {
    try {
        // جربنا نبعت الطلب لـ /api/doctors
        const response = await axios.get(`${API_BASE_URL}`); 
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Error fetching doctors");
    }
});

// 2. جلب بيانات دكتور واحد بالـ ID
export const fetchDoctorById = createAsyncThunk('doctor/fetchById', async (docId, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${docId}`); 
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Error fetching doctor details");
    }
});

// 3. جلب مواعيد الدكتور المسجل دخول
export const fetchDoctorAppointments = createAsyncThunk('doctor/fetchAppointments', async (_, { getState, rejectWithValue }) => {
>>>>>>> 0f1442d (edit login & register pages)
    try {
      const { auth } = getState();
      const config = { headers: { Authorization: `Bearer ${auth.token}` } };
      const response = await axios.get(`${API_BASE_URL}/appointments`, config);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching appointments",
      );
    }
  },
);

<<<<<<< HEAD
// 2. إتمام الموعد
export const completeAppointment = createAsyncThunk(
  "doctor/completeAppointment",
  async (appointmentId, { getState, rejectWithValue }) => {
=======
// 4. إتمام الموعد
export const completeAppointment = createAsyncThunk('doctor/completeAppointment', async (appointmentId, { getState, rejectWithValue }) => {
>>>>>>> 0f1442d (edit login & register pages)
    try {
      const { auth } = getState();
      const config = { headers: { Authorization: `Bearer ${auth.token}` } };
      await axios.patch(
        `${API_BASE_URL}/complete-appointment/${appointmentId}`,
        {},
        config,
      );
      return appointmentId;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  },
);

<<<<<<< HEAD
// 3. إلغاء موعد (من طرف الدكتور)
export const cancelDoctorAppointment = createAsyncThunk(
  "doctor/cancelAppointment",
  async (appointmentId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const config = { headers: { Authorization: `Bearer ${auth.token}` } };
      await axios.post(
        `${API_BASE_URL}/cancel-appointment`,
        { appointmentId },
        config,
      );
      return appointmentId;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  },
);

// 4. بروفايل الدكتور
export const getDoctorProfile = createAsyncThunk(
  "doctor/getProfile",
  async (_, { getState, rejectWithValue }) => {
=======
// 5. بروفايل الدكتور (نفسه)
export const getDoctorProfile = createAsyncThunk('doctor/getProfile', async (_, { getState, rejectWithValue }) => {
>>>>>>> 0f1442d (edit login & register pages)
    try {
      const { auth } = getState();
      const config = { headers: { Authorization: `Bearer ${auth.token}` } };
      const { data } = await axios.get(`${API_BASE_URL}/profile`, config);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  },
);

<<<<<<< HEAD
// 5. تحديث البروفايل
export const updateDoctorProfile = createAsyncThunk(
  "doctor/updateProfile",
  async (profileData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const config = { headers: { Authorization: `Bearer ${auth.token}` } };
      const { data } = await axios.post(
        `${API_BASE_URL}/update-profile`,
        profileData,
        config,
      );
      toast.success("Profile Updated!");
      return data.data;
    } catch (error) {
      toast.error(error.response.data.message);
      return rejectWithValue(error.response.data.message);
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
      .addCase(updateDoctorProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
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
          state.error =
            action.payload || action.error?.message || "Request failed";
        },
      );
  },
=======
const doctorSlice = createSlice({
    name: 'doctor',
    initialState: { 
        doctors: [],       
        selectedDoctor: null, 
        appointments: [], 
        profile: null, 
        loading: false, 
        error: null 
    },
    reducers: {
        clearDoctorState: (state) => { 
            state.appointments = []; 
            state.profile = null; 
            state.doctors = [];
            state.selectedDoctor = null;
        }
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
            .addCase(getDoctorProfile.fulfilled, (state, action) => {
                state.profile = action.payload;
                state.loading = false;
            })
            .addMatcher(action => action.type.endsWith('/pending'), (state) => { state.loading = true; })
            .addMatcher(action => action.type.endsWith('/rejected'), (state, action) => { 
                state.loading = false; 
                state.error = action.payload;
            });
    }
>>>>>>> 0f1442d (edit login & register pages)
});

export const { clearDoctorState } = doctorSlice.actions;
export default doctorSlice.reducer;
