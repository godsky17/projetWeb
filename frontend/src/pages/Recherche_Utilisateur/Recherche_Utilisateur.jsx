import React, { useState } from "react";
import { Button, Card, Form, InputGroup } from "react-bootstrap";
import Sidebar from '../../conpoments/SideBar/SideBar';
import './Recherche_Utilisateur.css'


const users = [
  { id: 1, name: "Friends Forever", description: "Come and enjoy with us!", avatar: "/images/jotaro.jpeg" },
  { id: 2, name: "Friends Forever", description: "Come and enjoy with us!", avatar: "/images/jotaro.jpeg" },
  { id: 3, name: "Friends Forever", description: "Come and enjoy with us!", avatar: "/images/jotaro.jpeg" },
  { id: 4, name: "Friends Forever", description: "Come and enjoy with us!", avatar: "/images/jotaro.jpeg" },
  { id: 5, name: "Friends Forever", description: "Come and enjoy with us!", avatar: "/images/jotaro.jpeg" },
  { id: 6, name: "Friends Forever", description: "Come and enjoy with us!", avatar: "/images/jotaro.jpeg" }
];

const RechercheUtilisateur = () => {
  const [search, setSearch] = useState("");

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="container shadow-sm recherche">
        <h2 className="fw-bold">Recherche d’un utilisateur</h2>
        <div className="search-bar">
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="search-input"
              />
        </div>
        <h5 className="fw-bold">Résultats &quot;{search}&quot;</h5>
        {users.map((user) => (
          <Card key={user.id} className="mb-3 p-3 shadow-sm" style={{border: "none"}}>
            <div className="d-flex align-items-center">
              <img src={user.avatar} alt="avatar" className="rounded-circle me-3" width="50" height="50" />
              <div className="flex-grow-1">
                <h6 className="fw-bold mb-0">{user.name}</h6>
                <small className="text-muted">{user.description}</small>
              </div>
              <Button style={{backgroundColor: "#B4D4F4", border: "none"}} className="me-2">Ajouter</Button>
              <Button style={{backgroundColor: "#B4D4F4", border: "none"}}>Supprimer</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RechercheUtilisateur;
