import React from "react";
import { asts } from "../assets/assets";

let Header = () => {
    return(
        <>

        <div className="flex flex-col md:flex-row flex-wrap bg-main rounded-lg px-6 md:px-10 lg:px-20">

            <div className="md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px]">

                <p className="text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight md:leading-tight lg:leading-tight">Book Appointment <br/> with a doctor</p>
                <div className="flex flex-col md:flex-row items-center gap-3 text-white text-sm text-light">
                    <img className="w-28" src={asts.group} alt="Gast"/>
                    <p>uwvjkdbs.bldk.n;owdslknd ldsbalikjln;ol ;klajknn;oalkndsokl  n;oawinoawlknvokln pqwj;liwekuewhu <br className="hidden sm:block"/> goeuigbrieaubalisdukilakjbvilksjbiwjksbiwujbiwjbiujwbijkbfiwlkps welh;fodqwl wiwehiekw vuh vuvwsi fwehpioa siubwdsn</p>
                </div>
                <a href="#speciality" className="flex items-center gap-2 bg-white px-8 py-3 rounded-full text-gray-600 text-sm m-auto md:m-0 hover:scale-105 transition-all duration-300">
                    Book Now <img className="w-3" src={asts.arrow} alt="arrow"/>
                </a>

            </div >
                
            <div className="md:w-1/2 relative">
                <img className="w-full md:absolute bottom-0 h-auto rounded-lg" src={asts.head} alt="header img"/>
            </div>
        </div>

        
        </>
    )
}

export default Header;