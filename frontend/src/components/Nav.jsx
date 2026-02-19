import React from "react";
import { useState } from "react";
import { asts } from "../assets/assets.js"
import { NavLink, useNavigate } from "react-router-dom";


let Nav = () => {

    let navg = useNavigate();

    let [showMenu, setShowMenu] = useState(false);
    let [token, setToken] = useState(false);

    return(
        <>
        <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
            
            <img src={asts.logo} alt="logo" className="w-44 cursor-pointer"/>

            
            <ul className="hidden md:flex items-start gap-5 font-medium">
                <NavLink to="/">
                    <li className="py-1">HOME</li>
                    <hr className="border-none outline-none h-0.5 bg-main w-3/5 m-auto hidden"/>
                </NavLink>
                <NavLink to="/doctors">
                    <li className="py-1">All Doctors</li>
                    <hr className="border-none outline-none h-0.5 bg-main w-3/5 m-auto hidden"/>
                </NavLink>
                <NavLink to="/about">
                    <li className="py-1">ABOUT</li>
                    <hr className="border-none outline-none h-0.5 bg-main w-3/5 m-auto hidden"/>
                </NavLink>
                <NavLink to="/contact">
                    <li className="py-1">CONTACT</li>
                    <hr className="border-none outline-none h-0.5 bg-main w-3/5 m-auto hidden"/>
                </NavLink>
                
            </ul>

            <div className="flex items-center gap-4"> 
                {token ? <div className="flex items-center gap-2 cursor-pointer group relative"> 
                    <img className="w-8 rounded-full" src={asts.prof}/>
                    <img className="w-2.5" src={asts.dropdown_icon}/>
                    <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
                        <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
                            <p onClick={()=>navg('profile')} className="hover:text-black cursor-pointer">profile</p>
                            <p onClick={()=>navg('appointments')} className="hover:text-black cursor-pointer">appointments</p>
                            <p onClick={()=>setToken(false)} className="hover:text-black cursor-pointer">logout</p>
                        </div>
                    </div>
                 </div> :<button onClick={()=>{navg('/register')}} className="bg-main text-white px-8 py-3 rounded-full hidden md:block">Create Acc</button> }
                 
            </div>
        </div>
        </>
    )
}

export default Nav;