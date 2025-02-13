import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Email from "./pages/Update/Email";
import Password from "./pages/Update/Password";
import ProfilePage from "./pages/Profile/Profile";

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        {/* Définir ProfilePage comme route par défaut */}
        <Route index element={<ProfilePage />} />
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
