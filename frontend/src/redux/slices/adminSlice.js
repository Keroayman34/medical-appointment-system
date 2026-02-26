import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = 'http://localhost:5000/api/v1/admin';

// 1. إضافة دكتور جديد
export const addDoctor = createAsyncThunk('admin/addDoctor', async (formData, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const config = { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${auth.token}` } };
        const { data } = await axios.post(`${API_BASE_URL}/add-doctor`, formData, config);
        toast.success("Doctor Added Successfully");
        return data;
    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
});

// 2. جلب كل الدكاترة للأدمن
export const getAllDoctors = createAsyncThunk('admin/getAllDoctors', async (_, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const config = { headers: { Authorization: `Bearer ${auth.token}` } };
        const { data } = await axios.get(`${API_BASE_URL}/all-doctors`, config);
        return data.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

// 3. تغيير حالة التوفر
export const changeAvailability = createAsyncThunk('admin/changeAvailability', async (docId, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const config = { headers: { Authorization: `Bearer ${auth.token}` } };
        await axios.post(`${API_BASE_URL}/change-availability`, { docId }, config);
        return docId;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

// 4. حذف دكتور
export const deleteDoctor = createAsyncThunk('admin/deleteDoctor', async (docId, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const config = { headers: { Authorization: `Bearer ${auth.token}` } };
        await axios.delete(`${API_BASE_URL}/delete-doctor/${docId}`, config);
        return docId;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

// 5. جلب إحصائيات الداشبورد (الأرقام)
export const getAdminDashboardData = createAsyncThunk('admin/getDashboardData', async (_, { getState, rejectWithValue }) => {
    try {
        const { auth } = getState();
        const config = { headers: { Authorization: `Bearer ${auth.token}` } };
        const { data } = await axios.get(`${API_BASE_URL}/dashboard`, config);
        return data.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

const adminSlice = createSlice({
    name: 'admin',
    initialState: { 
        loading: false, 
        error: null,
        doctors: [],        
        dashData: null      
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllDoctors.fulfilled, (state, action) => {
                state.doctors = action.payload;
                state.loading = false;
            })
            .addCase(changeAvailability.fulfilled, (state, action) => {
                state.doctors = state.doctors.map(doc => 
                    doc._id === action.payload ? { ...doc, available: !doc.available } : doc
                );
            })
            .addCase(deleteDoctor.fulfilled, (state, action) => {
                state.doctors = state.doctors.filter(doc => doc._id !== action.payload);
                toast.success("Doctor Removed");
            })
            .addCase(getAdminDashboardData.fulfilled, (state, action) => {
                state.dashData = action.payload;
                state.loading = false;
            })
            .addMatcher(action => action.type.endsWith('/pending'), (state) => { state.loading = true; })
            .addMatcher(action => action.type.endsWith('/rejected'), (state, action) => { 
                state.loading = false; 
                state.error = action.payload; 
            });
    },
});

export default adminSlice.reducer;