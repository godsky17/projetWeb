import React from 'react';
import './SideBar.css';

const SideBar = () => {
  return (
    <div className="sidebar">
      <div className="px-3">
        <div className="app-title">
          <img src="/images/logo.png" width="150px" alt="logo" style={{ filter: "brightness(0) invert(1)" }} />
        </div>
        
        <div className="nav flex-column mt-4">
          <div className="nav-item mb-2">
            <a className="nav-link d-flex align-items-center">
              <i className="far fa-chart-bar me-3"></i>
              Tableau de bord
            </a>
          </div>
          <div className="nav-item mb-2">
            <a className="nav-link d-flex align-items-center justify-content-between">
              <div>
                <i className="far fa-comments me-3"></i>
                Discussions
              </div>
              <span className="badge rounded-pill">4</span>
            </a>
          </div>
          <div className="nav-item mb-2">
            <a className="nav-link d-flex align-items-center">
              <i className="far fa-address-book me-3"></i>
              Contacts
            </a>
          </div>
          <div className="nav-item mb-2">
            <a className="nav-link d-flex align-items-center">
              <i className="fas fa-users me-3"></i>
              Groupes
            </a>
          </div>
          <div className="nav-item mb-2">
            <a className="nav-link d-flex align-items-center">
              <i className="far fa-folder me-3"></i>
              Archives
            </a>
          </div>
          <div className="nav-item mb-2">
            <a className="nav-link d-flex align-items-center justify-content-between">
              <div>
                <i className="far fa-envelope me-3"></i>
                Invitations
              </div>
              <span className="badge rounded-pill">10</span>
            </a>
          </div>
          <div className="nav-item mb-2">
            <a href="/profil" className="nav-link d-flex align-items-center">
              <i className="fas fa-cog me-3"></i>
              Parametres
            </a>
          </div>
          <div className="nav-item mb-2">
            <a className="nav-link d-flex align-items-center">
              <i className="fas fa-sign-out-alt me-3"></i>
              Deconnexion
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;