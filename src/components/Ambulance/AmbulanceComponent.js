import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';
import { cobertura } from '../../config/endpoints';
import Alert from '../GeneralComponents/Alert/Alerts';
import FooterBtn from '../GeneralComponents/FooterBtn';

const AmbulanceComponent = props => {
  const dispatch = useDispatch();
  const tiempo = useSelector(state => state.queries.ambulanceTime);
  const patient = useSelector(state => state.queries.patient)
  const [alert, setAlert] = React.useState({ display: false, type: '', title: '', customMessage: '' })

  const warnUser = () => {
    let data = {
      'ws': `${patient.ws}`,
      'dni': `${patient.dni}`,
      'address': `${props.address}`,
      'formatted_address': `${props.addressFormated}`, // formatted address retordeb by google API
      'dob': `${patient.dob}`,
      'sex': `${patient.sex}`,
      'fullname': `${patient.fullname}`,
      'lat': `${props.coords.lat}`,
      'lon': `${props.coords.lng}`,
      'service': 'AMB'
    }
    let headers = { 'Content-Type': 'Application/Json'/* , 'Authorization': token */ }
    axios.post(cobertura, data, headers)
      .then(res => setAlert({ display: true, type: 'success', title: 'Aviso registrado!', customMessage: 'Te notificaremos cuando haya cobertura en tu zona' }))
      .catch(err => setAlert({ display: true, type: 'danger', title: 'No pudimos registrar su pedido', customMessage: 'Ocurrió un error inesperado. Intentelo más tarde.' }))
  }
  const hideModal = () => {
    setAlert({ display: false })
    props.history.push(`/`)
  }

  return (
    <>
      {alert.display && <Alert alertType={alert.type} titleMessage={alert.title} customMessage={alert.customMessage} customAction={() => hideModal()} />}
      <div className="ambulance-container">
        {tiempo.includes("h") || (parseInt(tiempo) > 30) ?
          <>
            <div className="ambulance-circle">
              <FontAwesomeIcon icon={faTimesCircle} className="tag-delicon" />
            </div>
            <div className="ambulance-info">
              <b>Aún no disponemos de cobertura en esta zona</b>
            </div>
            <div className="ambulance-time">
              Estamos ampliando nuestra cobertura. <br />
              ¿Desea que le avisemos cuando dispongamos cobertura en tu zona?
            </div>
            <FooterBtn
              mode="single"
              text="avisarme cuando haya cobertura"
              callback={() => warnUser()}
              color="footer-warning"
            />
          </>
          :
          <>
            <div className="ambulance-circle">
              <FontAwesomeIcon icon={faCheck} className="tag-delicon" />
            </div>
            <div className="ambulance-info">
              <b>¡Contámos con cobertura en tu zona!</b>
            </div>

            <div className="ambulance-time">
              El tiempo médico de respuesta aproximado es de
              <b>
                {(parseInt(tiempo) > 10) ? `${tiempo}` : " 10 mins"}
              </b>
            </div>
            <FooterBtn
              mode="single"
              text="contratar servicio"
              callback={() => props.history.push('/checkout/amb')}
              color="footer-warning"
            />
          </>
        }
        <button
          className="recheck-button"
          type="button"
          onClick={() => dispatch({ type: "SET_AMBULANCE_HAVEDURATION", payload: false })}
        >
          Probar otra dirección
        </button>
      </div>
    </>
  );
};

export default withRouter(AmbulanceComponent);
