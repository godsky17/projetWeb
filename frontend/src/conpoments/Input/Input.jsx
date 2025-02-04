import React, { useState } from "react";
import {} from "./Input.css";

function Input (props) {

    return (
        <div className="input__group">
            <label htmlFor={props.name + "_id"} className="input__label">{props.label}</label>
            <input type={props.type} name={props.name} placeholder={props.placeholder} />
            <div className="error">
                <p>error</p>
            </div>
        </div>
    )
}

export default Input;