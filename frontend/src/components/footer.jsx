import React from "react";
import { asts } from "../assets/assets";

let Footer = () => {

    return(
        <>
        <div className="md:mx-10">
            <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">


                <div >
                    <img src={asts.logo} alt="" className=" mb-5 w-40"/>
                    <p className="w-full md:w-2/3 text-gray-600 leading-6">this site is created by team 3la allah</p>
                </div>


                <div>

                    <p className="text-xl font-medium mb-5">Company</p>
                    <ul className="flex flex-col gap-2 text-gray-600">
                        <li>Home</li>
                        <li>About us</li>
                        <li>Contact us</li>
                        <li>Privacy policy</li>
                    </ul>

                </div>
        

                <div >

                    <p className="text-xl font-medium mb-5">DET IN TOUCH</p>
                    <ul className="flex flex-col gap-2 text-gray-600">

                        <li>+201151877100</li>
                        <li>test@test.com</li>

                    </ul>


                </div>

                <div className="col-span-3">
                    <hr/>
                    <p className="py-5 text-sm text-center">Copyright © 2024 Team 3la Allah. All rights reserved.</p>
                </div>


            </div>
        </div>

        </>
    )
}

export default Footer;