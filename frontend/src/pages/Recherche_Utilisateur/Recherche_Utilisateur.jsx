import React, { useState } from "react";
import Sidebar from '../../conpoments/SideBar/SideBar';
import './Recherche_Utilisateur.css';

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
    <div className="layout">
      <Sidebar />
      <div className="recherche">
        <h2 className="title">Recherche d’un utilisateur</h2>
        
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Rechercher..." 
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <h5 className="results-title">Résultats &quot;{search}&quot;</h5>
        
        {users.map((user) => (
          <div key={user.id} className="user-card">
            <img src={user.avatar} alt="avatar" className="avatar" />
            <div className="user-info">
              <h6 className="user-name">{user.name}</h6>
              <small className="user-description">{user.description}</small>
            </div>
            <button className="btn add-btn">Ajouter</button>
            <button className="btn add-btn">Supprimer</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RechercheUtilisateur;
