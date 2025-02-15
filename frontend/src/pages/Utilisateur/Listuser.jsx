import React from "react";
import SideBar from "../../conpoments/SideBar/SideBar";
import Input from "../../conpoments/Input/Input";
import Main from "../../conpoments/Main/Main";
import { Link } from "react-router-dom";
import Item from "../../conpoments/Item/Item";
import Itemuser from "../../conpoments/Item/Itemuser";


const Listuser = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    return (
        <>
        <SideBar />
        <Main>
            <h1 className="title_2">Utilisateurs</h1>
            <Input 
                name="any"
                label = ""
                errors = ""
                placeholder = "Rechercher..."
                type = "any"
            />

            <div className="sub_title d-flex justify-content-between align-item-center">
                <p className="title_3 text-bold">Resultat</p>
                <Link to="/new-discussion" className="btn text-primary small">Nouvelle discussion</Link>
            </div>

            <div className="discussions_wrapper mt-20">
                <Itemuser />
            </div>

        </Main>

        </>
    )
}
  
  export default Listuser;