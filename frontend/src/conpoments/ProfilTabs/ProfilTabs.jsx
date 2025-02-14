import { useState } from 'react';
import './ProfilTabs.css';
import PasswordTab from '../ProfilPassword/ProfilPassword';


const ProfilTabs = ({ user }) => {
  const [activeTab, setActiveTab] = useState('informations');

  const handleChange = () => {
    const saveBtn = document.querySelector('.saveBtn');
    saveBtn.classList.replace("btn-secondary", "btn-primary")
    saveBtn.setAttribute('type', "submit")
  }

  function updateInfo(message) {
    setTimeout(() => {
        let modal = new bootstrap.Modal(document.getElementById('confirmationModal'));
        modal.show(); 
    }, 500); 
}

document.getElementById('confirmationModal')?.addEventListener('hidden.bs.modal', function () {
  location.reload();
});

  async function handleInfoSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.target)
    const fullName = form.get("fullName")
    const username = form.get("username")
    const email = form.get("email")
    const bio = form.get("bio")

    const response = await fetch('/api/user/update-profile', {
      method: "PATCH",
      body: JSON.stringify({
        identity: {
          fullName: fullName,
          bio: bio,
        },
        email: email,
        username: username
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
    localStorage.setItem("token", data.data.token);
    localStorage.setItem("user", JSON.stringify(data.data.user))
    updateInfo(data.message)


  }



  return (
    <div className="profile-tabs ProfileTabs">
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'informations' ? 'active' : ''}`}
            onClick={() => setActiveTab('informations')}
          >
            Informations
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            Mot de passe
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'photos' ? 'active' : ''}`}
            onClick={() => setActiveTab('photos')}
          >
            Photos
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'videos' ? 'active' : ''}`}
            onClick={() => setActiveTab('videos')}
          >
            Videos
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            Contacte bloquer
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'compte' ? 'active' : ''}`}
            onClick={() => setActiveTab('compte')}
          >
            Compte
          </button>
        </li>
      </ul>

      {activeTab === 'informations' && (
        <div className="tab-content p-4 bg-white rounded-bottom ">
          <form onSubmit={handleInfoSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Nom et prenoms</label>
                <input name='fullName' type="text" className="form-control input" defaultValue={user.identity['fullName']} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Nom d'utilisateur</label>
                <input type="text" name='username' className="form-control input" defaultValue={user.username} onChange={handleChange} />
              </div>
              <div className="col-md-12">
                <label className="form-label">Email</label>
                <input type="email" name='email' className="form-control input" defaultValue={user.email} onChange={handleChange} />
              </div>
              <div className="col-12">
                <label className="form-label">Bio</label>
                <textarea
                  className="form-control input"
                  name='bio'
                  rows="2"
                  defaultValue={user.identity['bio'] ? user.identity['bio'] : ""}
                  onChange={handleChange}
                ></textarea>
              </div>
              <div className="col-12 text-end">
                <button className="btn btn-secondary saveBtn">Sauvegarder</button>
              </div>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'password' && <PasswordTab />}

    <div class="modal fade" id="confirmationModal" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header border-0">
                    <h5 class="modal-title" id="modalLabel">Confirmation</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fermer"></button>
                </div>
                <div class="modal-body">
                   Modification effectue !
                </div>
                <div class="modal-footer border-0">
                    <button type="button" class="btn btn-success" data-bs-dismiss="modal">OK</button>
                </div>
            </div>
        </div>
    </div>
    </div>
    
  );
};

export default ProfilTabs;