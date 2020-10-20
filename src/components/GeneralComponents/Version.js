import React from 'react';
import { SignOut } from '../User/Login';

const Version = () => {
  function logout() {
    SignOut()
  }

  return (
    <div className="text-center">
      <p onClick={() => logout()} className="close-sesion">Cerrar sesión</p>
      <small className="mb-1 close-sesion">UMA Versión 1.1.46</small>
    </div>
  )
}

export default Version