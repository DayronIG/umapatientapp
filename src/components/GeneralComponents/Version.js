import React from 'react';
import { SignOut } from '../User/Login';

const Version = () => {
  function logout() {
    SignOut()
  }
  return (
    <div className="text-center">
      <p onClick={() => logout()} className="mb-3 close-sesion">{/* Cerrar sesión */}</p>
      <p>UMA Versión 1.1.46</p>
    </div>
  )
}

export default Version