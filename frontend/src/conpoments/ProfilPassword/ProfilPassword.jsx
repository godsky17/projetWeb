import React from 'react';
import './ProfilPassword.css';


const PasswordTab = () => {
  return (
    <div className="tab-content p-4 bg-white rounded-bottom ">
      <form>
        <div className="row g-3">
          <div className="row call1">
            <h6 className="col">Mot de passe actuelle</h6>
            <input type="password" className="form-control col" placeholder="********" />
          </div><hr></hr>
          <div className="row mt-4">
            <h6 className="col">Nouveau mot de passe</h6>
            <input type="password" className="form-control col" placeholder="********" />
          </div><hr></hr>
          <div className="row mt-5">
            <h6 className="col">Confirmer nouveau mot de passe</h6>
            <input type="password" className="form-control col" placeholder="********" />
          </div>
          <div className="col-12 text-end">
            <button type="submit" className="btn btn-secondary">Sauvegarder</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PasswordTab;
