import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {withRouter} from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faLaptopMedical } from "@fortawesome/free-solid-svg-icons";
import DoctorCard from '../OnlineDoctor/WhenScreen/DoctorCard';
import Loading from '../GeneralComponents/Loading';
import vmd from '../../assets/icons/vmd.png';
import "../../styles/Vmd/Vmd.scss";
import Alert from '../GeneralComponents/Alert/Alerts';

const VMDService = (props) => {
  const dispatch = useDispatch()
  const front = useSelector(state => state.front)
  const patient = useSelector(state => state.queries.patient)
  const remainingText = useSelector(state => state.front.remainingText);
  const firstAppointment = useSelector(state => state.assignations.firstAppointment);

  return (
    <>
      {front.loading ?
        <Loading />
        :
        <>
        {alert.display && <Alert alertType={alert.type} titleMessage={alert.title} customMessage={alert.customMessage} customAction={() => console.log()}  />}
        <div className='vmd-container'>
          <div>
            <div className="action-container">
              <div className="action-title">
                <b>Llamar a nuestro callcenter para coordinar la visita</b>
              </div>
            </div>
              <div className="action-call">
                  <span></span>
                  <span className="action-text"><a href="tel:08102220066">Llamar</a></span>
                  <a href="tel:08102220066"><FontAwesomeIcon icon={faPhone} className="action-icon" /></a>
              </div>
            </div>
            <div>
            <div className="action-container mt-5">
                <div className="action-title">
                    <b>O si lo prefiere puede realizar una consulta médica online</b>
                </div>
            </div>
            <div className="action-call" onClick={() => props.history.push(`/${patient.dni}/onlinedoctor/who`)}>
                  <span></span>
                  <span className="action-text"><a href="tel:08102220066">Iniciar una consulta</a></span>
              </div>
          </div>
          <div className="search-footer">
            <button className="check-button" onClick={() => props.history.push(`/`)}>
              <b>Volver</b>
            </button>
          </div> 
        </div>
        </>
      }
    </>
  );
};

export default withRouter(VMDService);
