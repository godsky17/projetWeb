import React, { useContext, useState } from "react";
import Input from "../../conpoments/Input/Input";
import "./form.css"
import Button from "../../conpoments/Buttons/Button";
import { AppContext } from "../../Context/AppContext";

const Form = () => {
    const [title, setTitle] = useState('');
    const user = JSON.parse(localStorage.getItem('user'))
    const handleSubmit = (e) => {
        e.preventDefault();
        const form = new FormData(e.target);
        const title = form.get("title");
        if (!title) {
            alert("Veiller remplir convenablement le champ")
        }

        alert(title);

    }

    
    return (
        <>
            <div className="container">
                <div className="form" onSubmit={handleSubmit}>
                    <form action="">
                        <h1>Form {user ? user.email : ""}</h1>
                        <Input label="Titre" placeholder="Entrer un titre" type="text" name="title" />
                        <Button className="btn small">Envoyer</Button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Form;