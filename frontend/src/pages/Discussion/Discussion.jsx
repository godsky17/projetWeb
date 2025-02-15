import React from "react";
import SideBar from "../../conpoments/SideBar/SideBar";
import Main from "../../conpoments/Main/Main";
import Input from "../../conpoments/Input/Input";
import Button from "../../conpoments/Buttons/Button";
import Item from "../../conpoments/Item/Item";
import "../../assets/commons.css"
import { Link, useNavigate } from "react-router-dom";


const Discussions = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    return (
        <>
        <SideBar />
        <Main>
            <h1 className="title_2">Liste des discussions</h1>
            <Input 
                name="any"
                label = ""
                errors = ""
                placeholder = "Rechercher..."
                type = "any"
            />

            <div className="sub_title d-flex justify-content-between align-item-center">
                <p className="title_3 text-bold">Resultat</p>
                <Link to="/list-user" className="btn text-primary small">Nouvelle discussion</Link>
            </div>

            <div className="discussions_wrapper mt-20">
                <Item />
            </div>

        </Main>

        </>
    )
}
  
  export default Discussions;