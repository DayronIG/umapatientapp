import React from 'react';
import { SignOut } from '../User/Login';
import version from '../../config/version.json';

const Version = () => {
  function logout() {
    SignOut()
  }

  return (
    <div className="text-center" style={{background: "white"}}>
      <p onClick={() => logout()} className="mb-3 close-sesion">Cerrar sesión</p>
      <p>{version.patients}</p>
    </div>
  )
}

export default Version