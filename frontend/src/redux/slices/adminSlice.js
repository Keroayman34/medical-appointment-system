import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL = "http://localhost:5000/api/v1/admin";
const SPECIALTY_API = "/api/specialties";
const DOCTOR_API = "/api/doctors";

export const fetchSpecialties = createAsyncThunk(
  "admin/fetchSpecialties",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(SPECIALTY_API);
      return data.specialties || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch specialties",
      );
    }
  },
);

export const createSpecialty = createAsyncThunk(
  "admin/createSpecialty",
  async (payload, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const config = { headers: { Authorization: `Bearer ${auth.token}` } };
      const { data } = await axios.post(SPECIALTY_API, payload, config);
      toast.success("Specialty added");
      return data.specialty;
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to add specialty";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  },
);

export const deleteSpecialty = createAsyncThunk(
  "admin/deleteSpecialty",
  async (specialtyId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const config = { headers: { Authorization: `Bearer ${auth.token}` } };
      await axios.delete(`${SPECIALTY_API}/${specialtyId}`, config);
      toast.success("Specialty deleted");
      return specialtyId;
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to delete specialty";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  },
);

export const fetchDoctorModeration = createAsyncThunk(
  "admin/fetchDoctorModeration",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${DOCTOR_API}/discover`);
      return data.doctors || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch doctors",
      );
    }
  },
);

export const approveDoctorByAdmin = createAsyncThunk(
  "admin/approveDoctor",
  async (doctorId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const config = { headers: { Authorization: `Bearer ${auth.token}` } };
      await axios.patch(`${DOCTOR_API}/${doctorId}/approve`, {}, config);
      toast.success("Doctor approved");
      return { doctorId, status: "approved" };
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to approve doctor";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  },
);

export const rejectDoctorByAdmin = createAsyncThunk(
  "admin/rejectDoctor",
  async (doctorId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const config = { headers: { Authorization: `Bearer ${auth.token}` } };
      await axios.patch(`${DOCTOR_API}/${doctorId}/reject`, {}, config);
      toast.success("Doctor rejected");
      return { doctorId, status: "rejected" };
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to reject doctor";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  },
);

// 1. إضافة دكتور جديد
export const addDoctor = createAsyncThunk(
  "admin/addDoctor",
  async (formData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${auth.token}`,
        },
      };
      const { data } = await axios.post(
        `${API_BASE_URL}/add-doctor`,
        formData,
        config,
      );
      toast.success("Doctor Added Successfully");
      return data;
    } catch (error) {
      toast.error(error.response.data.message);
      return rejectWithValue(error.response.data.message);
    }
  },
);

// 2. جلب كل الدكاترة للأدمن
export const getAllDoctors = createAsyncThunk(
  "admin/getAllDoctors",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const config = { headers: { Authorization: `Bearer ${auth.token}` } };
      const { data } = await axios.get(`${API_BASE_URL}/all-doctors`, config);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  },
);

// 3. تغيير حالة التوفر
export const changeAvailability = createAsyncThunk(
  "admin/changeAvailability",
  async (docId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const config = { headers: { Authorization: `Bearer ${auth.token}` } };
      await axios.post(
        `${API_BASE_URL}/change-availability`,
        { docId },
        config,
      );
      return docId;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  },
);

// 4. حذف دكتور
export const deleteDoctor = createAsyncThunk(
  "admin/deleteDoctor",
  async (docId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const config = { headers: { Authorization: `Bearer ${auth.token}` } };
      await axios.delete(`${API_BASE_URL}/delete-doctor/${docId}`, config);
      return docId;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  },
);

// 5. جلب إحصائيات الداشبورد (الأرقام)
export const getAdminDashboardData = createAsyncThunk(
  "admin/getDashboardData",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const config = { headers: { Authorization: `Bearer ${auth.token}` } };
      const { data } = await axios.get(`${API_BASE_URL}/dashboard`, config);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  },
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    loading: false,
    error: null,
    doctors: [],
    dashData: null,
    specialties: [],
    doctorModeration: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllDoctors.fulfilled, (state, action) => {
        state.doctors = action.payload;
        state.loading = false;
      })
      .addCase(changeAvailability.fulfilled, (state, action) => {
        state.doctors = state.doctors.map((doc) =>
          doc._id === action.payload
            ? { ...doc, available: !doc.available }
            : doc,
        );
      })
      .addCase(deleteDoctor.fulfilled, (state, action) => {
        state.doctors = state.doctors.filter(
          (doc) => doc._id !== action.payload,
        );
        toast.success("Doctor Removed");
      })
      .addCase(getAdminDashboardData.fulfilled, (state, action) => {
        state.dashData = action.payload;
        state.loading = false;
      })
      .addCase(fetchSpecialties.fulfilled, (state, action) => {
        state.specialties = action.payload;
        state.loading = false;
      })
      .addCase(createSpecialty.fulfilled, (state, action) => {
        state.specialties.push(action.payload);
        state.loading = false;
      })
      .addCase(deleteSpecialty.fulfilled, (state, action) => {
        state.specialties = state.specialties.filter(
          (item) => item._id !== action.payload,
        );
        state.loading = false;
      })
      .addCase(fetchDoctorModeration.fulfilled, (state, action) => {
        state.doctorModeration = action.payload;
        state.loading = false;
      })
      .addCase(approveDoctorByAdmin.fulfilled, (state, action) => {
        state.doctorModeration = state.doctorModeration.map((doctor) =>
          doctor._id === action.payload.doctorId
            ? { ...doctor, status: "approved", isApproved: true }
            : doctor,
        );
        state.loading = false;
      })
      .addCase(rejectDoctorByAdmin.fulfilled, (state, action) => {
        state.doctorModeration = state.doctorModeration.map((doctor) =>
          doctor._id === action.payload.doctorId
            ? { ...doctor, status: "rejected", isApproved: false }
            : doctor,
        );
        state.loading = false;
      })
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
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

export default adminSlice.reducer;
