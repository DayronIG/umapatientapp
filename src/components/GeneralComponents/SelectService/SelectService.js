import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import FileService from "./FileService";
import MobileModal from "../Modal/MobileModal";
import AmbulanceCard from '../../../assets/checkout/amb.png';
import VmdCard from '../../../assets/checkout/vmd.png';
import CmoCard from '../../../assets/checkout/cmo.png';
import waiting from '../../../assets/icons/waiting.png';
import '../../../styles/Services.scss';

const SelectService = (props) => {
  const [modalFile, setModalFile] = React.useState({ state: false, type: '' })

  return (
    <>
      {modalFile.state &&
        <MobileModal callback={() => setModalFile(!modalFile.state)}>
          <FileService type={modalFile.type} />
        </MobileModal>
      }
      <div className="services-container">
        <div className="ambulance-service">
          <div className="title">
            <p>Servicio a pagar</p>
          </div>
          {props.service === "office" &&
            <>
              <div className="service">
                <p className="service-description">
                  Turno en consultorio
                                </p>
                <span className="service-amount">Copago de $400</span>
              </div>
              <div className="service-image">
                <img src={waiting} alt="en construcción"
                  style={{ width: '120px' }} />
              </div>
            </>}
          {props.service === "cmo" &&
            <>
              <div className="service">
                <p className="service-description">
                  Doctor online
                                    <span className="ml-1" onClick={() => setModalFile({ state: !modalFile.state, type: 'cmo' })}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                  </span>
                </p>
                <span className="service-amount">${props.price} <small>/ mes</small></span>
              </div>
              <img src={CmoCard} alt="Ambulancia" />
            </>}
          {props.service === "vmd" &&
            <>
              <div className="service">
                <p className="service-description">
                  Visita médica domiciliaria
                                    <span className="ml-1" onClick={() => setModalFile({ state: !modalFile.state, type: 'vmd' })}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                  </span>
                </p>
                <span className="service-amount">${props.price} <small>/ mes</small></span>
              </div>
              <img src={VmdCard} alt="Ambulancia" />
            </>}
          {props.service === "amb" &&
            <>
              <div className="service">
                <p className="service-description">
                  Servicio de ambulancias
                  <span className="ml-1" onClick={() => setModalFile({ state: !modalFile.state, type: 'amb' })}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                  </span>
                </p>
                <span className="service-amount">${props.price} <small>/ mes</small></span>
              </div>
              <img src={AmbulanceCard} alt="Ambulancia" />
            </>
          }
        </div>
      </div>
    </>
  )
}

export default SelectService;