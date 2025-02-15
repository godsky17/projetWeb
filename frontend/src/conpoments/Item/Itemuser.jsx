import React, { useState, useEffect } from "react";
import './Item.css';
import img_profile from "../../assets/images/img_update_2.png";
import Button from "../Buttons/Button";

const Itemuser = () => {
    const [users, setUsers] = useState([]);
    const [messageError, setMessageError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5;

    // Récupérer les utilisateurs depuis le localStorage
    useEffect(() => {
        const storedUsers = localStorage.getItem('users');
        if (storedUsers) {
            setUsers(JSON.parse(storedUsers));
        } else {
            getUsersFromAPI();
        }
    }, []);

    const getUsersFromAPI = async () => {
        try {
            const response = await fetch('/api/users', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
            });

            const data = await response.json();

            if (data.errors) {
                setMessageError(data.errors);
            } else {
                setUsers(data.data.users);
                localStorage.setItem('users', JSON.stringify(data.data.users)); // Persister dans le localStorage
            }
        } catch (error) {
            setMessageError("Erreur lors de la récupération des utilisateurs.");
            console.error("Erreur lors de la requête :", error);
        }
    };

    const handleDeleteUser = (userId) => {
        const updatedUsers = users.filter(user => user.id !== userId);
        setUsers(updatedUsers);
        localStorage.setItem('users', JSON.stringify(updatedUsers)); // Mettre à jour le localStorage après suppression
    };

    const handleAddUser = async (userId) => {
        try {
            const response = await fetch("/api/contact/send-request", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    "idUser2": userId
                })
            });

            const data = await response.json();
            if (data.status_code === 201) {
                setSuccessMessage("Demande de contact envoyée.");
                handleDeleteUser(userId); // Supprime l'utilisateur après la demande réussie
            } else {
                setMessageError("Erreur lors de l'envoi de la demande.");
            }
        } catch (error) {
            setMessageError("Erreur de connexion au serveur.");
        }
    };

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    return (
        <>
            {messageError && (
                <div className="error_box text-center mt-10">
                    <p className="title_2">{messageError}</p>
                </div>
            )}

            {successMessage && (
                <div className="success_box text-center mt-10">
                    <p className="title_2">{successMessage}</p>
                </div>
            )}

            {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                    <div className="item" key={user.id}>
                        <div className="profil_wrapper">
                            <div>
                                <img src={img_profile} alt="" className="profil_img" />
                            </div>
                            <div className="full_info">
                                <p className="title_3 text-bold">{user.identity['fullName']}</p>
                                <p className="last_message">{user.username || "Aucun message"}</p>
                            </div>
                        </div>
                        <div className="item_option d-flex">
                            <Button className="btn small" onClick={() => handleAddUser(user.id)}>Ajouter</Button>
                            <Button className="btn small" onClick={() => handleDeleteUser(user.id)}>Supprimer</Button>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-center mt-10">Aucun utilisateur disponible.</p>
            )}

            {users.length > usersPerPage && (
                <div className="pagination">
                    <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="pagination-btn">
                        Précédent
                    </button>
                    <span>Page {currentPage} / {Math.ceil(users.length / usersPerPage)}</span>
                    <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage >= Math.ceil(users.length / usersPerPage)} className="pagination-btn">
                        Suivant
                    </button>
                </div>
            )}
        </>
    );
};

export default Itemuser;
