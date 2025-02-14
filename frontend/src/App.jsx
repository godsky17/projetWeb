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


function App() {
  const user = JSON.parse(localStorage.getItem('user'))

  return (
    <>

      <BrowserRouter>
        <Routes>
            <Route index element={user ? <ProfilePage /> : <Login />} />
            <Route path='/register' element={user ? <ProfilePage /> : <Register />} />
            <Route path='/update-password' element={user ? <ProfilePage /> : <Email />} />
            <Route path='/new-password' element={user ? <ProfilePage /> : <Password />} />
            <Route path='/confirmed-email' element={user ? <ProfilePage /> : <Verify />} />
            <Route path='/test/form' element={<Form />}/>
             <Route path='/profile' element={<ProfilePage />} />
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
