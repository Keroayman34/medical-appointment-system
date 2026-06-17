import React from "react";

let Footer = () => {

    return(
        <>
        <div className="md:mx-10 mt-28 mb-8">
            <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-10 text-sm rounded-3xl border border-[#7AAACE]/40 bg-[#F7F8F0]/90 p-8 md:p-10 shadow-[0_12px_32px_rgba(53,88,114,0.12)]">


                <div >
                    <img src="/vite.svg" alt="logo" className="mb-5 w-12 h-12"/>
                    <p className="w-full md:w-2/3 text-[#355872] leading-7 font-medium">Medical Appointment System helps patients book faster and helps doctors manage time efficiently.</p>
                </div>


                <div>

                    <p className="text-xl font-bold mb-5 text-[#355872]">Company</p>
                    <ul className="flex flex-col gap-2 text-[#355872]">
                        <li>Home</li>
                        <li>About us</li>
                        <li>Contact us</li>
                        <li>Privacy policy</li>
                    </ul>

                </div>
        

                <div >

                    <p className="text-xl font-bold mb-5 text-[#355872]">Get In Touch</p>
                    <ul className="flex flex-col gap-2 text-[#355872]">

                        <li>+201151877100</li>
                        <li>test@test.com</li>

                    </ul>


                </div>

                <div className="col-span-3">
                    <hr className="border-[#7AAACE]/50"/>
                    <p className="py-5 text-sm text-center text-[#355872]">Copyright © 2026 Medical Appointment System. All rights reserved.</p>
                </div>


            </div>
        </div>

        </>
    )
}

export default Footer;