import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    approveDoctorByAdmin,
    createSpecialty,
    deleteSpecialty,
    fetchDoctorModeration,
    fetchSpecialties,
    rejectDoctorByAdmin,
} from "../redux/slices/adminSlice";

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const { specialties, doctorModeration, loading, error } = useSelector((state) => state.admin);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        dispatch(fetchSpecialties());
        dispatch(fetchDoctorModeration());
    }, [dispatch]);

    const getDoctorStatus = (doctor) => {
        if (doctor?.status) return doctor.status;
        if (doctor?.isApproved) return "approved";
        return "pending";
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!name.trim()) return;

        const result = await dispatch(createSpecialty({
            name: name.trim(),
            description: description.trim(),
        }));

        if (result.meta.requestStatus === "fulfilled") {
            setName("");
            setDescription("");
        }
    };

    return (
        <div className="p-5 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-[#355872] mb-6">Admin Specialty Management</h1>

            <form onSubmit={handleSubmit} className="bg-white border border-[#7AAACE]/40 rounded-xl p-5 mb-6">
                <p className="font-semibold text-[#355872] mb-3">Add New Specialty</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                        className="border border-[#9CD5FF]/75 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#7AAACE] outline-none"
                        placeholder="Specialty Name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        required
                    />
                    <input
                        className="border border-[#9CD5FF]/75 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#7AAACE] outline-none"
                        placeholder="Description"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                    />
                </div>
                <button
                    type="submit"
                    className="mt-4 px-6 py-2 rounded-full bg-main text-white hover:shadow-lg hover:opacity-90 transition-all active:scale-95"
                    disabled={loading}
                >
                    {loading ? "Saving..." : "Add Specialty"}
                </button>
            </form>

            <div className="bg-white border border-[#7AAACE]/40 rounded-xl p-5">
                <p className="font-semibold text-[#355872] mb-3">All Specialties</p>
                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

                {specialties?.length ? (
                    <div className="space-y-2">
                        {specialties.map((item) => (
                            <div key={item._id} className="flex items-center justify-between border border-[#7AAACE]/30 rounded-lg px-3 py-2 bg-[#F7F8F0]/50 hover:bg-[#F7F8F0]/85 transition-colors">
                                <div>
                                    <p className="font-medium text-[#355872]">{item.name}</p>
                                    {item.description ? <p className="text-xs text-[#355872]/60">{item.description}</p> : null}
                                </div>
                                <button
                                    className="text-red-600 text-sm hover:underline font-semibold"
                                    onClick={() => dispatch(deleteSpecialty(item._id))}
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-[#355872]/60 text-sm">No specialties found.</p>
                )}
            </div>

            <div className="bg-white border border-[#7AAACE]/40 rounded-xl p-5 mt-6">
                <p className="font-semibold text-[#355872] mb-3">Doctors Moderation Status</p>

                {doctorModeration?.length ? (
                    <div className="space-y-2">
                        {doctorModeration.map((doctor) => {
                            const status = getDoctorStatus(doctor);
                            const badgeClass =
                                status === "approved"
                                    ? "bg-green-100 text-green-700"
                                    : status === "rejected"
                                        ? "bg-red-100 text-red-700"
                                        : "bg-yellow-100 text-yellow-700";

                            return (
                                <div key={doctor._id} className="border border-[#7AAACE]/30 rounded-lg px-3 py-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2 bg-[#F7F8F0]/50 hover:bg-[#F7F8F0]/85 transition-colors">
                                    <div>
                                        <p className="font-medium text-[#355872]">{doctor?.user?.name || "Doctor"}</p>
                                        <p className="text-xs text-[#355872]/60">{doctor?.specialty?.name || "No specialty"}</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${badgeClass}`}>{status}</span>
                                        <button
                                            className="px-3 py-1 text-xs rounded bg-green-600 text-white disabled:bg-gray-300 hover:bg-green-700 transition-colors"
                                            disabled={status === "approved" || loading}
                                            onClick={() => dispatch(approveDoctorByAdmin(doctor._id))}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            className="px-3 py-1 text-xs rounded bg-red-600 text-white disabled:bg-gray-300 hover:bg-red-700 transition-colors"
                                            disabled={status === "rejected" || loading}
                                            onClick={() => dispatch(rejectDoctorByAdmin(doctor._id))}
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-[#355872]/60 text-sm">No doctors found.</p>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;