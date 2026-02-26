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
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Specialty Management</h1>

            <form onSubmit={handleSubmit} className="bg-white border rounded-xl p-5 mb-6">
                <p className="font-semibold text-gray-700 mb-3">Add New Specialty</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                        className="border rounded-lg px-3 py-2"
                        placeholder="Specialty Name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        required
                    />
                    <input
                        className="border rounded-lg px-3 py-2"
                        placeholder="Description"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                    />
                </div>
                <button
                    type="submit"
                    className="mt-4 px-6 py-2 rounded-full bg-main text-white"
                    disabled={loading}
                >
                    {loading ? "Saving..." : "Add Specialty"}
                </button>
            </form>

            <div className="bg-white border rounded-xl p-5">
                <p className="font-semibold text-gray-700 mb-3">All Specialties</p>
                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

                {specialties?.length ? (
                    <div className="space-y-2">
                        {specialties.map((item) => (
                            <div key={item._id} className="flex items-center justify-between border rounded-lg px-3 py-2">
                                <div>
                                    <p className="font-medium text-gray-800">{item.name}</p>
                                    {item.description ? <p className="text-xs text-gray-500">{item.description}</p> : null}
                                </div>
                                <button
                                    className="text-red-600 text-sm"
                                    onClick={() => dispatch(deleteSpecialty(item._id))}
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm">No specialties found.</p>
                )}
            </div>

            <div className="bg-white border rounded-xl p-5 mt-6">
                <p className="font-semibold text-gray-700 mb-3">Doctors Moderation Status</p>

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
                                <div key={doctor._id} className="border rounded-lg px-3 py-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                    <div>
                                        <p className="font-medium text-gray-800">{doctor?.user?.name || "Doctor"}</p>
                                        <p className="text-xs text-gray-500">{doctor?.specialty?.name || "No specialty"}</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${badgeClass}`}>{status}</span>
                                        <button
                                            className="px-3 py-1 text-xs rounded bg-green-600 text-white disabled:bg-gray-300"
                                            disabled={status === "approved" || loading}
                                            onClick={() => dispatch(approveDoctorByAdmin(doctor._id))}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            className="px-3 py-1 text-xs rounded bg-red-600 text-white disabled:bg-gray-300"
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
                    <p className="text-gray-500 text-sm">No doctors found.</p>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;