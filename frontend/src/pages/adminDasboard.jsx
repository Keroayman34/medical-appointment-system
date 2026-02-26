import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getAllDoctors, changeAvailability, deleteDoctor } from "../redux/slices/adminSlice";

const Doctors = ({ isAdmin = false }) => {
    const { speciality } = useParams();
    const navg = useNavigate();
    const dispatch = useDispatch();
    
    const { doctors, loading } = useSelector((state) => state.admin);
    const [filterDoc, setFilterDoc] = useState([]);

    useEffect(() => {
        dispatch(getAllDoctors());
    }, [dispatch]);

    useEffect(() => {
        if (speciality) {
            setFilterDoc(doctors.filter(d => d.specialty === speciality));
        } else {
            setFilterDoc(doctors);
        }
    }, [doctors, speciality]);

    // مصفوفة التخصصات لعرضها كأزرار علوية
    const specialities = [
        'General physician', 'Gynecologist', 'Dermatologist', 
        'Pediatricians', 'Neurologist', 'Gastroenterologist'
    ];

    if (loading) return <p className="text-center py-20 text-xl font-medium">Loading Doctors List...</p>;
    
    return (
        <div className="p-5 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center sm:text-left">
                {isAdmin ? "Manage Doctors Control Panel" : "Browse Doctors by Speciality"}
            </h1>

            {/* --- أزرار التخصصات العلوية (بديلة للـ Side Bar) --- */}
            {!isAdmin && (
                <div className="flex flex-wrap justify-center sm:justify-start gap-3 mb-10">
                    <button 
                        onClick={() => navg('/doctors')}
                        className={`px-4 py-2 rounded-full border text-sm transition-all ${!speciality ? 'bg-main text-white border-main' : 'bg-white text-gray-600 hover:border-main'}`}
                    >
                        All Doctors
                    </button>
                    {specialities.map((spec, index) => (
                        <button 
                            key={index}
                            onClick={() => speciality === spec ? navg('/doctors') : navg(`/doctors/${spec}`)}
                            className={`px-4 py-2 rounded-full border text-sm transition-all ${speciality === spec ? 'bg-main text-white border-main' : 'bg-white text-gray-600 hover:border-main'}`}
                        >
                            {spec}
                        </button>
                    ))}
                </div>
            )}

            {/* --- شبكة عرض الدكاترة بعرض الشاشة الكامل --- */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filterDoc.map((item, index) => (
                    <div 
                        key={index} 
                        className="border border-gray-200 rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl hover:translate-y-[-5px] transition-all duration-300 bg-white"
                    >
                        <div className="relative">
                            <img 
                                onClick={() => !isAdmin && navg(`/appointment/${item._id}`)} 
                                className="w-full h-52 object-cover bg-indigo-50" 
                                src={item.image} 
                                alt={item.name} 
                            />
                            {/* علامة التوفر الصغيرة */}
                            {!isAdmin && (
                                <div className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-[10px] font-bold uppercase shadow-sm ${item.available ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                    {item.available ? '● Available' : '● Busy'}
                                </div>
                            )}
                        </div>
                        
                        <div className="p-5">
                            <p onClick={() => !isAdmin && navg(`/appointment/${item._id}`)} className="text-lg font-bold text-gray-900 truncate">{item.name}</p>
                            <p className="text-main text-xs font-semibold uppercase tracking-wider mb-3">{item.specialty}</p>
                            
                            {isAdmin ? (
                                <div className="space-y-3 pt-3 border-t">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-500 font-bold">Status:</span>
                                        <div className="flex items-center gap-2">
                                            <input 
                                                type="checkbox" 
                                                className="w-4 h-4 accent-main cursor-pointer"
                                                checked={item.available} 
                                                onChange={() => dispatch(changeAvailability(item._id))} 
                                            />
                                            <span className="text-xs text-gray-600">Active</span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => { if(window.confirm("Are you sure?")) dispatch(deleteDoctor(item._id)) }}
                                        className="w-full py-2 bg-red-50 text-red-600 text-xs font-bold rounded-lg hover:bg-red-600 hover:text-white transition-all"
                                    >
                                        Delete Doctor
                                    </button>
                                </div>
                            ) : (
                                <button onClick={() => navg(`/appointment/${item._id}`)} className="w-full mt-2 py-2 border border-main text-main rounded-lg text-xs font-bold hover:bg-main hover:text-white transition-all">
                                    Book Visit
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {filterDoc.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-gray-400 text-lg">No doctors found in this specialty.</p>
                </div>
            )}
        </div>
    );
};

export default Doctors;