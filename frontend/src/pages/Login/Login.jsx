import React from "react";

import './Login.css'
import '../../assets/commons.css'
import Input from "../../conpoments/Input/Input";
import Button from "../../conpoments/Buttons/Button";

function Login() {
    const handleSubmit = (e) => {
        e.preventDefault();
        const form = new FormData(e.target);
        const email = form.get("email");
        const password = form.get("password");
        fetch("http://127.0.0.1:8002/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(response => response.json())
        .then((data) => {
            console.log(data.message)
        })
        .catch(error => console.error("Erreur :", error));
    }
    return (
        <>
            <div className="login__wrapper">
                <div className="col infos">
                    Hlllo
                </div>
                <div className="col form__container">
                    <p className="title_1 color-primary">Connexion</p>
                    <form onSubmit={handleSubmit}>
                        <Input label="Identifiant" name="email" placeholder="Identifiant" type="email" />
                        <Input label="Mot de passe" name="password" placeholder="*********" type="password" />
                        <Button className="btn medium full">Connexion</Button>
                        <p className="mt-20 text-center">Vous n'avez pas de compte ? <a href="/register" className="color-primary text-bold">Inscrivez-vous</a></p>
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