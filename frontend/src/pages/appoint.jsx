import React, { useState , useEffect , useContext, use} from "react";
import { useParams } from "react-router-dom";
import { appContext } from "../context/appContext.jsx";
import { asts } from "../assets/assets.js";
import RelateDoc from "../components/relateDoc.jsx";

const Appoint = () => {
    
    let {docID} = useParams();

    let {doctors, curuncy} = useContext(appContext);

    let day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

    let [docInfo, setDocInfo] = useState(null);
    let [docSlots, setDocSlots] = useState([]);
    let [slotIndex, setSlotIndex] = useState(0);
    let [slotTime, setSlotTime] = useState('');

    let fetchDocInfo = async() => {
        let docid = parseInt(docID);
        let docInfo = doctors.find(d => d._id === docid)
        console.log(docInfo)
        setDocInfo(docInfo)

    }

    let getSlots = () => {

        setDocSlots([])

        let today = new Date();
        for(let i = 0; i < 7; i++) {
            let curuntDate = new Date(today);
            curuntDate.setDate(today.getDate() + i);

            let endTime = new Date();
            endTime.setDate(today.getDate() + i);
            endTime.setHours(21,0, 0, 0);

            if(today.getDate() === curuntDate.getDate()) {
                curuntDate.setHours(curuntDate.getHours() > 10 ? curuntDate.getHours() + 1 : 10);
                curuntDate.setMinutes(curuntDate.getMinutes() > 30 ? 30 : 0);

            }else{
                curuntDate.setHours(10);
                curuntDate.setMinutes(0);
            }


            let slots = [];

            while(curuntDate <= endTime) {
                let formatTime = curuntDate.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
                slots.push({
                    date: new Date(curuntDate),
                    time: formatTime
                });

                curuntDate.setMinutes(curuntDate.getMinutes() + 30);
            }
            setDocSlots(prev => ([...prev,slots]));
        }




    }

    useEffect(() => {
        fetchDocInfo();
    }, [doctors, docID]);

    useEffect(() => {
        if(docInfo) {
            getSlots();
        }
    }, [docInfo])

    useEffect(() => {
        console.log(docSlots);
    }, [docSlots])
    
    return docInfo && (
        <>
            <div className="flex flex-col sm:flex-row gap-4">
                <div>
                    <img className="w-full sm:max-w-72 rounded-lg" src={docInfo.img} alt={docInfo.name} />
                </div>

                <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
                    <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
                        {docInfo.name}
                        <img className="w-5" src={asts.verf} alt="" />
                    </p>

                    <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
                        <p>{docInfo.degree} - {docInfo.speciality}</p>
                        <button className="py-0.5 px-2 border text-xs rounded-full">{docInfo.experiance}</button>
                    </div>

                    <div className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
                        about <img src={asts.info} alt="" />
                        <p className="text-sm text-gray-500 max-w-[700px] mt-1">{docInfo.about}</p>
                    </div>
                    <p className="text-gray-500 mt-4 font-medium">fee: <span className="text-gray-600">{curuncy}{docInfo.fees}</span></p>

                </div>
                
            </div>
            <div className="sm:ml-72 sm:pl-6 mt-6 font-medium text-gray-700">
                <p>Booking Times</p>
                <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
                    {
                        docSlots.length && docSlots.map((daySlots, index) =>( 

                            <div onClick={()=> setSlotIndex(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-main text-white' : 'border border-gray-200'}`} key={index}>

                                <p>{daySlots[0] && day[daySlots[0].date.getDay()]}</p>
                                <p>{daySlots[0] && daySlots[0].date.getDay()}</p>

                            </div>
                        ))
                    }
                </div>
                
                <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
                    {docSlots.length && docSlots[slotIndex].map((slot, index) => (
                        <p onClick={()=> setSlotTime(slot.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${slot.time === slotTime ? 'bg-main text-white' : 'text-gray-400 border border-gray-200'}`} >
                            {slot.time.toLowerCase()}
                        </p>
                    ))}
                </div>

                <button className="my-6 px-14 py-3 text-sm font-light rounded-full bg-main text-white">Book Appointment</button>
            </div>

            <RelateDoc docID={docID} speciality={docInfo.speciality}/>
        </>
    )
}

export default Appoint;