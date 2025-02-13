import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Email from "./pages/Update/Email";
import Password from "./pages/Update/Password";
import Form from "./pages/test/form";
import Verify from './pages/VerifyEmail/Verify';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
            <Route index element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/update-password' element={<Email />} />
            <Route path='/new-password' element={<Password />} />
            <Route path='/confirmed-email' element={<Verify />} />
            <Route path='/test/form' element={<Form />}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
