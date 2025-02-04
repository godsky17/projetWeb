
import React from 'react'
import Container from './conpoments/Container/Container'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Email from './pages/Update/Email'
import Password from './pages/Update/Password'
import Verification from './pages/OptVerification/Verification'

function App() {

  return (
    <>
      <Container>
          <Verification />
      </Container>
    </>
  )
}

export default App
