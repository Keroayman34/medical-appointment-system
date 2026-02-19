import React from "react";
import Header from "../components/header.jsx";
import SpecialityMnu from "../components/specialityMnu.jsx";
import TopDoc from "../components/topDoc.jsx";
import Baner from "../components/baner.jsx";

let Home = () => {
    return(
        <>
        <div>
            <Header/>
            <SpecialityMnu/>
            <TopDoc/>
            <Baner/>
        </div>
        </>
    )
}

export default Home;