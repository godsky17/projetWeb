import React, { useContext, useState } from "react";

import '../Login/Login.css'
import '../Register/Register.css'
import '../../assets/commons.css'
import Input from "../../conpoments/Input/Input";
import Button from "../../conpoments/Buttons/Button";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";

function Register() {
    const navigate = useNavigate()
    const {token, setToken} = useContext(AppContext)
    const [errors, setErrors] = useState({});
    let user = {};

    async function handleSubmit(e) {
        e.preventDefault();
        const form = new FormData(e.target);
        const myEmail = form.get('email');
        const fullName = form.get("fullName");
        const username = form.get("username");
        const password = form.get("password");
        const password_confirmation = form.get("password_confirmation");
        user = {
            identity: {
                fullName: fullName,
            },
            email: myEmail,
            username: username,
            password: password,
            password_confirmation: password_confirmation,
        }

        const response = await fetch("/api/register", {
            method: 'POST',
            body: JSON.stringify(user)
        });

        const data = await response.json();

        if (data.errors) {
            setErrors(data.errors);
        }
        localStorage.setItem("token", data.data['verifyToken'])
        localStorage.setItem("user", JSON.stringify(data.data))
        navigate("/confirmed-email")
    }
    return (
        <>
            <div className="register__wrapper">
                <div className="col infos">
                    Hlllo
                </div>
                <div className="col form__container">
                    <p className="title_1 color-primary">S'inscrire</p>
                    <form onSubmit={handleSubmit}>
                        <p></p>
                        <div className="step__1">
                            <Input label="Nom" name="fullName" placeholder="Nom" type="text" errors={errors?.["identity.fullName"]?.[0]}/>
                            <Input label="Prénom(s)" name="username" placeholder="Prénom(s)" type="text" errors={errors?.username?.[0]} />
                            <Input label="Email" name="email" placeholder="monemail@gmail.com" type="email" value={user.email} errors={errors?.email?.[0]} />
                        </div>
                        <div className="step__2">
                            <Input label="Mot de passe" name="password" placeholder="*********" type="password" errors={errors?.password?.[0]} />
                            <Input label="Mot de passe" name="password_confirmation" placeholder="*********" type="password" />
                        </div>
                        <p>
                            En créant un compte, vous acceptez notre <span className="text-bold">politique de confidentialité</span> et notre <span className="text-bold">politique de communication électronique</span>.
                        </p>
                        <Button className="btn medium full nextButton" >S'inscrire</Button>
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