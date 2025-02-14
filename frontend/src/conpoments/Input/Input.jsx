import React, { useState } from "react";
import { } from "./Input.css";

function Input({name,label,errors,placeholder,type}) {
    return (
        <div className="input__group">
            <label htmlFor={name + "_id"} className="input__label">{label}</label>
            <input type={type} name={name} placeholder={placeholder} />
            {errors &&
                <div className="error">
                    <p>{errors}</p>
                </div>}
        </div>
    )
}

export default Input;