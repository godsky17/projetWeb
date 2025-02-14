import React, { useContext, useState } from "react";

import './Login.css'
import '../../assets/commons.css'
import Input from "../../conpoments/Input/Input";
import Button from "../../conpoments/Buttons/Button";
import { AppContext } from "../../Context/AppContext";
import { useNavigate } from "react-router-dom";
import bg from "../../assets/images/connexion_image.png"
import logo from "../../assets/images/logo_white.png"

function Login() {
    const { setToken } = useContext(AppContext)
    const navigate = useNavigate()
    const [errors, setErrors] = useState()

    async function handleSubmit(e) {
        e.preventDefault();
        const form = new FormData(e.target);
        const email = form.get("email");
        const password = form.get("password");
        const response = await fetch("api/login", {
            method: "POST",
            body: JSON.stringify({
                email: email,
                password: password
            })
        })

        const data = await response.json();

        if (data.errors) {
            setErrors(data.errors)
        } else {
            localStorage.setItem("token", data.data.token);
            localStorage.setItem("user", JSON.stringify(data.data.user));
            setToken(data.data.token);
            navigate("/");
        }

    }

    return (
        <>
            <div className="login__wrapper">
                <div className="col infos">
                    <img src={bg} alt="" srcset="" className="infos_bg" />
                    <div className="surface">
                        <img src={logo} alt="" className="surface_img" />
                        <div className="text">
                            <p className="title_3 text-white">Prêt à plonger dans la conversation ?</p>
                            <p className=" text-white">Les meilleures discussions n'attendent pas. Tes amis sont déjà là… et toi ? Déverrouille le fun. Connecte-toi et rejoins l’action !</p>
                        </div>
                    </div>
                </div>
                <div className="col form__container">
                    <div className="form">
                        <p className="title_2 color-primary">Connexion</p>
                        <form onSubmit={handleSubmit}>
                            <Input label="Identifiant" name="email" placeholder="Identifiant" type="email" errors={!Array.isArray(errors) ? errors?.email : errors?.email?.[0]} />
                            <Input label="Mot de passe" name="password" placeholder="*********" type="password" errors={errors?.password?.[0]} />
                            <Button className="btn medium full">Connexion</Button>
                            <p className="mt-20 text-center">Vous n'avez pas de compte ? <a href="/register" className="color-primary text-bold">Inscrivez-vous</a></p>
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

export default Login;