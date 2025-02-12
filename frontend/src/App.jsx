import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Email from "./pages/Update/Email";
import Password from "./pages/Update/Password";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
            <Route index element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/update-password' element={<Email />} />
            <Route path='/new-password' element={<Password />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
