import React from "react";
import './Verification.css'
import img from "../../assets/images/mail_img.png";
import OTPInput from "../../conpoments/OTPInput/OTPInput";
import Button from "../../conpoments/Buttons/Button";

function Verification() {
    return (
        <div className="wrapper">
            <nav>
                <p className="title_3 color-primary">chatApp</p>
            </nav>
            <div className="opt__verification">
                    <img className="img" src={img} alt="" />
                    <p className="title_2 color-primary">OPT verification</p>
                    <p>Nous avons envoyer le code de verification a <span className="text-bold">jaydensmith@gmail.com</span></p>
                    <OTPInput></OTPInput>
                    <p className="text-bold mt-10">Renvoyer le code</p>
                    <div className="mt-20">
                    <Button className="btn medium full">Envoyer</Button>
                    </div>

            </div>
        </div>
    )
}

export default Verification;