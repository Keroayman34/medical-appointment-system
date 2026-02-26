import React, { useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchDoctors } from "../redux/slices/doctorSlice";
import { asts } from "../assets/assets";

const Doctors = () => {
    const { speciality } = useParams();
    const navg = useNavigate();
    const dispatch = useDispatch();

    const { doctors, loading } = useSelector((state) => state.doctors);

    useEffect(() => {
        dispatch(fetchDoctors());
    }, [dispatch]);

    const specialities = useMemo(() => {
        const names = doctors
            .map((doctor) => doctor?.specialty?.name)
            .filter(Boolean);
        return [...new Set(names)];
    }, [doctors]);

    const filteredDoctors = useMemo(() => {
        if (!speciality) return doctors;
        return doctors.filter((doctor) => doctor?.specialty?.name === speciality);
    }, [doctors, speciality]);

    if (loading) return <p className="text-center py-20 text-xl font-medium">Loading Doctors List...</p>;

    return (
        <div className="p-5 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center sm:text-left">
                Browse Doctors by Specialty
            </h1>

            <div className="flex flex-wrap justify-center sm:justify-start gap-3 mb-10">
                <button
                    onClick={() => navg('/doctors')}
                    className={`px-4 py-2 rounded-full border text-sm transition-all ${!speciality ? 'bg-main text-white border-main' : 'bg-white text-gray-600 hover:border-main'}`}
                >
                    All Doctors
                </button>
                {specialities.map((spec) => (
                    <button
                        key={spec}
                        onClick={() => speciality === spec ? navg('/doctors') : navg(`/doctors/${spec}`)}
                        className={`px-4 py-2 rounded-full border text-sm transition-all ${speciality === spec ? 'bg-main text-white border-main' : 'bg-white text-gray-600 hover:border-main'}`}
                    >
                        {spec}
                    </button>
                ))}
            </div>

            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredDoctors.map((item) => (
                    <div
                        key={item._id}
                        className="border border-gray-200 rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl hover:translate-y-[-5px] transition-all duration-300 bg-white"
                    >
                        <div className="relative">
                            <img
                                onClick={() => navg(`/appointment/${item._id}`)}
                                className="w-full h-52 object-cover bg-indigo-50"
                                src={item?.user?.image || asts.doc}
                                alt={item?.user?.name || 'Doctor'}
                            />
                            <div className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-[10px] font-bold uppercase shadow-sm ${item?.isApproved ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-700'}`}>
                                {item?.isApproved ? '● Available' : '● Pending'}
                            </div>
                        </div>

                        <div className="p-5">
                            <p onClick={() => navg(`/appointment/${item._id}`)} className="text-lg font-bold text-gray-900 truncate">{item?.user?.name || 'Doctor'}</p>
                            <p className="text-main text-xs font-semibold uppercase tracking-wider mb-3">{item?.specialty?.name || 'Specialty'}</p>

                            <button onClick={() => navg(`/appointment/${item._id}`)} className="w-full mt-2 py-2 border border-main text-main rounded-lg text-xs font-bold hover:bg-main hover:text-white transition-all">
                                Book Visit
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredDoctors.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-gray-400 text-lg">No doctors found.</p>
                </div>
            )}
        </div>
    );
};

export default Doctors;