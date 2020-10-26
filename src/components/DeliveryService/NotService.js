import React from 'react';
import { useHistory } from 'react-router-dom';
import noservice from "../../assets/icons/underConstruction.png";
import FooterBtn from "../GeneralComponents/FooterBtn";

const NotService = () => {
  const history = useHistory();
  return (
    <div className="laboratory__container text-center">
      <h3 className="laboratory__header">No tienes servicios pendientes</h3>
      <img src={noservice} alt="hisopado negativo" />
      <FooterBtn type='submit' text='Continuar' callback={() => history.push("/")} />
    </div>
  )
}

export default NotService
