import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { GenericHeader } from '../GeneralComponents/Headers';
import Loading from '../GeneralComponents/Loading';
import FooterBtn from '../GeneralComponents/FooterBtn';
import Alert from '../GeneralComponents/Alert/Alerts';
import "../../styles/Vmd/Vmd.scss";

const AmbulanceService = (props) => {
  const dispatch = useDispatch()
  const front = useSelector(state => state.front)

  return (
    <>
      <GenericHeader>Ambulancia</GenericHeader>
      {front.loading ?
        <Loading />
        :
        <>
          {alert.display && <Alert alertType={alert.type} titleMessage={alert.title} customMessage={alert.customMessage} customAction={() => console.log()} />}
          <div className='vmd-container mt-5'>
            <div className="action-container mt-3">
              <div className="action-title">
                <h4>Riesgo de vida</h4><br />
                <span>Por favor utilizar el servicio con responsabilidad</span>
              </div>
            </div>
            <div className="action-call">
              <span className="action-text"><a href="tel:08102220066">Llamar</a></span>
              <a href="tel:08104440911"><FontAwesomeIcon icon={faPhone} className="action-icon" /></a>
            </div>
            <FooterBtn
              mode="single"
              text="volver"
              callback={() => props.history.push(`/`)}
            />
          </div>
        </>
      }
    </>
  );
};

export default withRouter(AmbulanceService);
