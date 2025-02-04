import React, { useState } from "react";

import '../Login/Login.css'
import '../Register/Register.css'
import '../../assets/commons.css'
import Input from "../../conpoments/Input/Input";
import Button from "../../conpoments/Buttons/Button";

function Register() {

    return (
        <>
            <div className="register__wrapper">
                <div className="col infos">
                    Hlllo
                </div>
                <div className="col form__container">
                    <p className="title_1 color-primary">S'inscrire</p>
                    <form action="">
                        <p></p>
                        <div className="step__1">
                            <Input label="Nom" name="lastName" placeholder="Nom" type="text" />
                            <Input label="Prénom(s)" name="firstName" placeholder="Prénom(s)" type="text" />
                            <Input label="Email" name="email" placeholder="monemail@gmail.com" type="email" />
                        </div>
                        <div className="step__2">
                            <Input label="Mot de passe" name="password" placeholder="*********" type="password" />
                            <Input label="Mot de passe" name="confirmation_password" placeholder="*********" type="password" />
                        </div>
                        <p>
                            En créant un compte, vous acceptez notre <span className="text-bold">politique de confidentialité</span> et notre <span className="text-bold">politique de communication électronique</span>.
                        </p>
                        <Button className="btn medium full nextButton">S'inscrire</Button>
                        <p className="mt-20 text-center">Vous n'avez pas de compte ? <a href="" className="color-primary text-bold">Inscrivez-vous</a></p>
                    </form>
                    <ul className="items">
                        <li className="item"><a href="">Politique de confidentialite</a></li>
                        <li className="item"><a href="">Politique de confidentialite</a></li>
                    </ul>
                </div>
            </div>
        </>
    )
}

export default Register;