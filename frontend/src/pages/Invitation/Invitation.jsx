import React, { useState, useEffect } from "react";
import SideBar from "../../conpoments/SideBar/SideBar";
import Main from "../../conpoments/Main/Main";
import "../../assets/commons.css";
import { useNavigate } from "react-router-dom";
import Input from "../../conpoments/Input/Input";

const Invitation = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [discussions, setDiscussions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [messageError, setMessageError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Remplacer par l'API qui renvoie les discussions de l'utilisateur
        const fetchDiscussions = async () => {
            try {
                const response = await fetch('api/contact/requests', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                const data = await response.json();
                console.log(data)
                if (data.errors) {
                    setMessageError(data.errors);
                } else {
                    setDiscussions(data.data); // Si les discussions sont dans 'data.data'
                }
            } catch (error) {
                setMessageError("Erreur de récupération des invitations.");
            } finally {
                setLoading(false);
            }
        };

        fetchDiscussions();
    }, []);

    const handleNew = () => {
        navigate('/new-discussion');
    };

    return (
        <>
            <SideBar />
            <Main>
                <h1 className="title_2">Liste des invitations</h1>

                <div className="form_container">
                    <Input label="Recherche..." />
                </div>

                {messageError && (
                    <div className="error_box text-center mt-10">
                        <p className="title_2">{messageError}</p>
                    </div>
                )}

                {loading ? (
                    <p>Chargement des discussions...</p>
                ) : discussions.length > 0 ? (
                    <div>
                        <ul className="discussion-list">
                            {discussions.map((discussion) => (
                                <li key={discussion.id} className="discussion-item">
                                    <div className="discussion-details">
                                        <p><strong>{discussion.title}</strong></p>
                                        <p>{discussion.lastMessage}</p>
                                    </div>
                                    <button onClick={() => navigate(`/discussion/${discussion.id}`)}>Voir la discussion</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p>Aucune discussion trouvée.</p>
                )}
            </Main>
        </>
    );
};

export default Invitation;
