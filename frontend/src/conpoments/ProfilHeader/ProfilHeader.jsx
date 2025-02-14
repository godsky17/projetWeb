import React from 'react';
import './ProfilHeader.css';

const ProfilHeader = ({user}) => {
  return (
    <div className="profile-header">
      <div className="banner"></div>
      <div className="profile-info ps-4">
        {/* Remplacement de la div par une image */}
        <img 
          src="/images/jotaro.jpeg" 
          alt="Photo de profil" 
          className="profile-pic"
        />
        <div className="profile-text">
          <h2 className="fw-bold mb-0">{user.identity['fullName']}</h2>
          <p className="text-muted">{user.email}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilHeader;
