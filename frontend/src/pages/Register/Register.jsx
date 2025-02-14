import React, { useContext, useState } from "react";

import '../Login/Login.css'
import '../Register/Register.css'
import '../../assets/commons.css'
import Input from "../../conpoments/Input/Input";
import Button from "../../conpoments/Buttons/Button";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import bg from "../../assets/images/inscription_bg.png";
import logo from "../../assets/images/logo_white.png";

function Register() {
    const navigate = useNavigate()
    const { token, setToken } = useContext(AppContext)
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
        localStorage.setItem("email", data.data['email'])
        navigate("/confirmed-email")
    }
    return (
        <>
            <div className="login__wrapper">
                <div className="col infos">
                    <img src={bg} alt="" srcset="" className="infos_bg" />
                    <div className="surface">
                        <img src={logo} alt="" className="surface_img" />
                        <div className="text">
                            <p className="title_3 text-white">Bienvenue dans l'aventure !</p>
                            <p className=" text-white">T’es sur le point de rejoindre LA plateforme où ça discute, ça partage et ça vibe non-stop.</p>
                        </div>
                    </div>
                </div>
                <div className="col form__container">
                    <div className="form">
                        <p className="title_2 color-primary">S'inscrire</p>
                        <form onSubmit={handleSubmit}>
                                <div className="input_group">
                                <Input label="Nom et prenom" name="fullName" placeholder="Nom" type="text" errors={errors?.["identity.fullName"]?.[0]} />
                                <Input label="Username" name="username" placeholder="username" type="text" errors={errors?.username?.[0]} />
                                </div>
                                <Input label="Email" name="email" placeholder="monemail@gmail.com" type="email" value={user.email} errors={errors?.email?.[0]} />   
                                <div className="input_group">
                                <Input label="Mot de passe" name="password" placeholder="*********" type="password" errors={errors?.password?.[0]} />
                                <Input label="Mot de passe" name="password_confirmation" placeholder="*********" type="password" />
                                </div>
                            
                            
                            <Button className="btn medium full nextButton" >S'inscrire</Button>
                            <p className="mt-20 text-center">Vous n'avez pas de compte ? <a href="" className="color-primary text-bold">Inscrivez-vous</a></p>
                        </form>
                        <ul className="items">
                            <li className="item"><a href="">Politique de confidentialite</a></li>
                            <li className="item"><a href="">Politique de confidentialite</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Register;