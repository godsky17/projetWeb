import React, { useState } from "react";
import './Item.css'
import img_profile from "../../assets/images/img_update_2.png"
import archiverIcon from "../../assets/images/archiveicons.png"
import pinIcon from "../../assets/images/Pin.png"
import muteIcon from "../../assets/images/no_audio.png"
import discussionIcon from "../../assets/images/icon.png"
const Item = () => {
    const [discutions, setDiscutions] = useState()
    const [messageError, setMessageError] = useState()
    async function getDiscussions() {
        try {
            await fetch('/api/discussions/unarchived', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },

            }).then(res => {
                return res
            }).then((data) => {
                if (data.data) {
                    console.log("oui")
                } else {
                    setMessageError("Aucune discutions !")
                }
            });
        } catch (error) {
            console.error("Erreur lors de l'envoi du message :", error);
        }
    }
    const handleClick = () => {
        const menu = document.querySelector('.menu')
        menu.classList.add("show")
    }

    getDiscussions()
    return (
        <>
            {messageError ?
                <div className="error_box text-center mt-10" >
                    <p className="title_2">{messageError ? messageError : ""}</p>
                </div>
                :

                <div className="item">
                    <div className="profil_wrapper">
                        <div className="">
                            <img src={img_profile} alt="" className="profil_img" />
                        </div>
                        <div className="full_info">
                            <p className="title_3 text-bold">Friends</p>
                            <p className="last_message">Hello !</p>
                        </div>
                    </div>
                    <div className="item_option">
                        <img src="https://img.icons8.com/ios-glyphs/30/ellipsis.png" alt="" srcset="" onClick={handleClick} />
                        <p>Today, 9:52pm</p>
                    </div>
                    <div className="menu">
                        <ul className="menu_items ">
                            <a href="">
                                <li className="menu_item">
                                    <img src={archiverIcon} alt="" srcset="" />
                                    <p>Archiver</p>
                                </li>
                            </a>

                            <a href="">
                                <li className="menu_item">
                                    <img src={muteIcon} alt="" srcset="" />
                                    <p>Mute</p>
                                </li>
                            </a>

                            <a href="">
                                <li className="menu_item">
                                    <img src={pinIcon} alt="" srcset="" />
                                    <p>Epingler</p>
                                </li>
                            </a>

                            <a href="">
                                <li className="menu_item">
                                    <img src={discussionIcon} alt="" srcset="" />
                                    <p>Discussion</p>
                                </li>
                            </a>


                        </ul>
                    </div>
                </div>
            }
        </>
    )
}

export default Item