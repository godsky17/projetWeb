import React from "react";

import './Login.css'
import '../../assets/commons.css'
import Input from "../../conpoments/Input/Input";
import Button from "../../conpoments/Buttons/Button";

function Login() {
    return (
        <>
            <div className="login__wrapper">
                <div className="col infos">
                    Hlllo
                </div>
                <div className="col form__container">
                    <p className="title_1 color-primary">Connexion</p>
                    <form action="">
                        <Input label="Identifiant" name="username" placeholder="Identifiant" type="text" />
                        <Input label="Mot de passe" name="mdp" placeholder="*********" type="password" />
                        <Button className="btn medium full">Connexion</Button>
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

export default Login;