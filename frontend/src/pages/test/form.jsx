import React, { useState } from "react";
import Input from "../../conpoments/Input/Input";
import "./form.css"
import Button from "../../conpoments/Buttons/Button";

const Form = () => {
    const [title, setTitle] = useState('');
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
                        <h1>Form</h1>
                        <Input label="Titre" placeholder="Entrer un titre" type="text" name="title" />
                        <Button className="btn small">Envoyer</Button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Form;