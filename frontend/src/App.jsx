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
import { useNavigate } from "react-router-dom";
import Discussions from './pages/Discussion/Discussion';
import Listdiscussion from './pages/Discussion/Listediscustion';
import Listuser from './pages/Utilisateur/Listuser';
import Invitation from './pages/Invitation/Invitation';

function App() {
  const user = JSON.parse(localStorage.getItem('user'))

  return (
    <>
    <BrowserRouter>
      <Routes>
        {/* Définir ProfilePage comme route par défaut */}
        <Route index element={user ? <RechercheUtilisateur /> : <Login />} />
        <Route path='/message' element={user ? <Message /> : <Login />} />
        <Route path='/profil' element={ user ? <ProfilePage /> : <Login />} />
        <Route path='/login' element={ user ? <Message /> : <Login />} />
        <Route path='/register' element={ <Register /> } />
        <Route path='/update-password' element={ user ? <Email /> : <Login />} />
        <Route path='/new-password' element={ user ? <Password /> : <Login />} />
        <Route path='/liste-discution' element={ user ? <Discussions /> : <Login />} />
        <Route path='/list-user' element={ user ? <Listuser /> : <Login />} />
        <Route path='/new-discussion' element={ user ? <Listdiscussion /> : <Login />} />
        <Route path='/invitation' element={ user ? <Invitation /> : <Login />} />
      </Routes>
    </BrowserRouter>

    </>
  )
}

export default App
