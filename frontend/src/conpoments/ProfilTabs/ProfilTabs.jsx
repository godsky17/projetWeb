import { useState } from 'react';
import './ProfilTabs.css';
import PasswordTab from '../ProfilPassword/ProfilPassword';


const ProfilTabs = () => {
  const [activeTab, setActiveTab] = useState('informations');

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
          <form>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Nom</label>
                <input type="text" className="form-control" defaultValue="SMITH" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Prenom(s)</label>
                <input type="text" className="form-control" defaultValue="SMITH" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" defaultValue="jadeysmith@gmail.com" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Numero de telephone</label>
                <input type="tel" className="form-control" defaultValue="00229 00125478" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Ville</label>
                <input type="text" className="form-control" defaultValue="Cotonou" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Date de naissance</label>
                <input type="text" className="form-control" defaultValue="10/02/1998" />
              </div>
              <div className="col-12">
                <label className="form-label">Bio</label>
                <textarea 
                  className="form-control" 
                  rows="2"
                  defaultValue="Lorem ipsum is simply dummy text of the printing and typesetting industry."
                ></textarea>
              </div>
              <div className="col-12 text-end">
                <button type="submit" className="btn btn-secondary">Sauvegarder</button>
              </div>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'password' && <PasswordTab />}
    </div>
  );
};

export default ProfilTabs;