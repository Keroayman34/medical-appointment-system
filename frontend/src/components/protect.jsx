import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
    const { token, user } = useSelector((state) => state.auth);

    // لو مفيش توكن يرجعه لصفحة الـ Login
    if (!token) return <Navigate to="/login" replace />;

    // لو الدور (Role) مش مسموح له يرجعه للرئيسية
    if (!allowedRoles.includes(user?.role)) return <Navigate to="/" replace />;

    return <Outlet />; // كمل وافتح الصفحة
};

export default ProtectedRoute;