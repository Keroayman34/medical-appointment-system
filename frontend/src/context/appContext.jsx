import { createContext } from "react";
import doctors from "../assets/assets";


export let appContext = createContext()

let AppContextProvider = (props)=>{

    let curuncy = '$';
    let val = {doctors, curuncy};

    return(
        <>
        <appContext.Provider value={val}>
            {props.children}
        </appContext.Provider>
        </>
    )
}

export default AppContextProvider;