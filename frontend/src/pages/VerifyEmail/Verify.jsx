import React, { useContext, useState } from 'react'
import '../OptVerification/Verification.css'
import img from "../../assets/images/mail_img.png";
import Button from "../../conpoments/Buttons/Button";
import { AppContext } from '../../Context/AppContext';


function Verify() {
  const { token } = useContext(AppContext)
  const [errors, setErrors] =useState({})
  const email = localStorage.getItem('email')

  async function handleClick() {
    const token = localStorage.getItem('token')
    const response = await fetch('api/send-reset-link?token=' + token)

    const data = await response.json();

    if (data.errors) {
      setErrors(data.errors);
    }
  }

  return (
    <div className="wrapper">
      <nav>
        <p className="title_3 color-primary">chatApp</p>
      </nav>
      <div className="opt__verification">
        <img className="img" src={img} alt="" />
        <p className="title_2 color-primary">OPT verification</p>
        <p className='mt-10'>Nous avons envoyer le code de verification a <span className="text-bold">{email}</span></p>

        <div className="mt-20">
          <Button className="btn medium full" onClick={handleClick}>Renvoyer le code</Button>
        </div>

      </div>
    </div>
  )
}

export default Verify