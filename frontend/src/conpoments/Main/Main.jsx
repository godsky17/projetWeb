import React from "react";
import "./Main.css"

const Main = ({children}) => {
    return (
        <>
        <div className="main">
            <div className="main_container">
            {children}
            </div>
        </div>
        </>
    )
}

export default Main