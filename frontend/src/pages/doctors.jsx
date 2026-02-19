import React,{useContext,useEffect,useState} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { appContext } from "../context/appContext.jsx";

let Doctors = () => {


    let { speciality } = useParams();

    let [fiterdoc, setFilteredDoc] = useState([]);
    
    let navg = useNavigate();

    let { doctors } = useContext(appContext);


    let filter = () => {
        if(speciality ){
            setFilteredDoc(doctors.filter(d => d.speciality === speciality));
        }else {
            setFilteredDoc(doctors);
        }
    }

    useEffect(() => {
        filter();
    }, [doctors, speciality]);

    return(
        <>
        <div>
            <p className="text-gray-600">choose speciality</p>
            <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
                <div className="flex flex-col text-sm gap-4 text-gray-600">
                    <p onClick={()=> speciality === 'General physician'? navg('/doctors'):navg('/doctors/General physician')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'General physician' ? 'text-black bg-indigo-500' : ''}`}>General physician</p>
                    <p onClick={()=> speciality === 'Dermatologist'? navg('/doctors'):navg('/doctors/Dermatologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Dermatologist' ? 'text-black bg-indigo-500' : ''}`}>Dermatologist</p>
                    <p onClick={()=> speciality === 'Neurologist'? navg('/doctors'):navg('/doctors/Neurologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Neurologist' ? 'text-black bg-indigo-500' : ''}`}>Neurologist</p>
                    <p onClick={()=> speciality === 'Pediatrician'? navg('/doctors'):navg('/doctors/Pediatrician')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Pediatrician' ? 'text-black bg-indigo-500' : ''}`}>Pediatrician</p>
                    <p onClick={()=> speciality === 'Genacologist'? navg('/doctors'):navg('/doctors/Genacologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Genacologist' ? 'text-black bg-indigo-500' : ''}`}>Genacologist</p>
                    <p onClick={()=> speciality === 'Gastroenterologist'? navg('/doctors'):navg('/doctors/Gastroenterologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Gastroenterologist' ? 'text-black bg-indigo-500' : ''}`}>Gastroenterologist</p>
                </div>
                <div className="w-full grid grid-cols-auto gap-4 gap-y-6">
                    {fiterdoc.map(
                        (item, index) => {
                            return(
                                <div onClick={()=>navg(`/Appint/${item._id}`)} key={index} className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500">
                                    <img className="w-40 h-40 object-cover rounded-full mx-auto bg-blue-50" src={item.img} alt="" />
                                    <div className="p-4">
                                        <div className="flex items-center gap-2 text-sm text-center text-green-500">
                                            <p className="w-2 h-2 bg-green-500 rounded-full"></p><p>Available</p>
                                        </div>
                                        <p className="text-lg font-medium text-gray-900">{item.name}</p>
                                        <p className="text-gray-600 text-sm">{item.speciality}</p>
                                    </div>
                                </div>
                            )
                        }
                    )
                    }
                </div>
            </div>
        </div>
        </>
    )
}

export default Doctors;