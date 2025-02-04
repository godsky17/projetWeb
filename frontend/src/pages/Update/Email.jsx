import React from "react";

import'../Login/Login.css'
import '../../assets/commons.css'
import Input from "../../conpoments/Input/Input";
import Button from "../../conpoments/Buttons/Button";

function Email() {
    return (
        <>
            <div className="login__wrapper">
                <div className="col infos">
                    Hlllo
                </div>
                <div className="col form__container">
                    <p className="title_1 color-primary">Modification du mot de passe</p>
                    <form action="">
                        <Input label="Email" name="email" placeholder="monemail@gmail.com" type="email" />
                        <Button className="btn medium full">Envoyer</Button>
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

export default Email;