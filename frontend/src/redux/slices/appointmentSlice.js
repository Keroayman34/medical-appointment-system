import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const APPOINTMENTS_API = "/api/appointments";

// 1. أكشن لحجز موعد جديد
export const bookAppointment = createAsyncThunk(
  "appointments/book",
  async (appointmentData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState(); // جلب التوكن من الـ auth slice
      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      };
      const response = await axios.post(
        `${APPOINTMENTS_API}`,
        appointmentData,
        config,
      );
      return response.data.appointment;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "حدث خطأ أثناء الحجز",
      );
    }
  },
);

// 2. أكشن لجلب حجوزات المريض الحالي
export const fetchMyAppointments = createAsyncThunk(
  "appointments/fetchMy",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      };
      const response = await axios.get(`${APPOINTMENTS_API}/my`, config);
      return response.data.appointments;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "فشل جلب المواعيد",
      );
    }
  },
);

export const cancelAppointment = createAsyncThunk(
  "appointments/cancel",
  async (appointmentId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const config = { headers: { Authorization: `Bearer ${auth.token}` } };
      // نرسل طلب تعديل الحالة إلى cancelled
      await axios.patch(
        `${APPOINTMENTS_API}/${appointmentId}/cancel`,
        {},
        config,
      );
      return appointmentId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "فشل إلغاء الموعد",
      );
    }
  },
);

// داخل الـ extraReducers أضف:
// .addCase(cancelAppointment.fulfilled, (state, action) => {
//    state.myAppointments = state.myAppointments.filter(app => app._id !== action.payload);
// })

const appointmentSlice = createSlice({
  name: "appointments",
  initialState: {
    myAppointments: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    // لتصفير حالة النجاح بعد عرض الرسالة للمستخدم
    resetStatus: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // حالات الحجز (Booking)
      .addCase(bookAppointment.pending, (state) => {
        state.loading = true;
      })
      .addCase(bookAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.myAppointments.push(action.payload);
      })
      .addCase(bookAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // حالات جلب المواعيد (Fetch)
      .addCase(fetchMyAppointments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.myAppointments = action.payload;
      })
      .addCase(fetchMyAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.myAppointments.findIndex(
          (app) => app._id === action.payload,
        );
        if (index !== -1) {
          // نغير الحالة في الـ UI دون الحاجة لعمل Refresh للصفحة
          state.myAppointments[index].status = "cancelled";
        }
      })
      .addCase(cancelAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetStatus } = appointmentSlice.actions;
export default appointmentSlice.reducer;
