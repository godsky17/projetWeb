import React, { useContext } from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Email from "./pages/Update/Email";
import Password from "./pages/Update/Password";
import Form from "./pages/test/form";
import Verify from './pages/VerifyEmail/Verify';
import { AppContext } from './Context/AppContext';
import ProfilePage from "./pages/Profile/Profile";
import Message from './pages/Message/Message';
import RechercheUtilisateur from './pages/Recherche_Utilisateur/Recherche_Utilisateur';


function App() {
  const user = JSON.parse(localStorage.getItem('user'))

  return (
    <>
    <BrowserRouter>
      <Routes>
        {/* Définir ProfilePage comme route par défaut */}
        <Route index element={<Message />} />
        <Route path='/message' element={<Message />} />
        <Route path='/profil' element={<ProfilePage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/update-password' element={<Email />} />
        <Route path='/new-password' element={<Password />} />
      </Routes>
    </BrowserRouter>

    </>
  )
}

export default App
