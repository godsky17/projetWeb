import React from 'react';
import './ProfilPassword.css';


const PasswordTab = () => {
  const handleChange = () => {
    const saveBtn = document.querySelector('.saveBtn');
    saveBtn.classList.replace("btn-secondary", "btn-primary")
    saveBtn.setAttribute('type', "submit")
  }

  async function handlePassSubmit(e){
    e.preventDefault();
    const form = new FormData(e.target)
    const current_password = form.get("current_password")
    const new_password = form.get("new_password")

    const response = await fetch('/api/user/update-password', {
      method: "PATCH",
      body: JSON.stringify({
        current_password: current_password,
        new_password: new_password
      }),
      headers: {
        "Content-Type": "application/json", 
        "Authorization": `Bearer ${localStorage.getItem('token')}` 
      }
    });

    const data = await response.json(); 
    if(data.errors){
      console.error(data)
    }

    localStorage.clear()
    location.reload();
  }


  return (
    <div className="tab-content p-4 bg-white rounded-bottom ">
      <form onSubmit={handlePassSubmit}>
        <div className="row g-3">
          <div className="row call1">
            <h6 className="col">Mot de passe actuelle</h6>
            <input type='password' name="current_password" className="form-control col" placeholder="********" onChange={handleChange} />
          </div><hr></hr>
          <div className="row mt-4">
            <h6 className="col">Nouveau mot de passe</h6>
            <input type='password' name="new_password" className="form-control col" placeholder="********" onChange={handleChange}/>
          </div>
          <div className="col-12 text-end">
            <button type="submit" className="btn btn-secondary saveBtn">Sauvegarder</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PasswordTab;
