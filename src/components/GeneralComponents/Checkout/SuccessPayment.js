import React from 'react';
import {withRouter} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import ambulance from '../../../assets/icons/ambulance.png';

const SuccessPayment = (props) => {
    return(
        <div className="checkoutresponse-container">
            <div className="checkoutresponse-title">¡Felicitaciones!</div>
            <div className="checkoutresponse-body">
                <div className="checkoutresponse-description">Se ha procesado exitosamente el pago.</div>
                <div className="checkoutresponse-image">
                    <img src={ambulance} alt="Servicio de ambulancias" />
                    <FontAwesomeIcon icon={faCheck} className="checkoutresponse-check" />
                </div>
                <div className="checkoutresponse-backto">
                    <p>El servicio aparecerá como activo en el menú principal</p>
                </div>
            </div>
            <div className="checkoutresponse-footer">
                <button className="btn back-button" onClick={() => props.history.push(`/`)}>Volver al menú</button>
            </div>
        </div>
    )
}

export default withRouter(SuccessPayment);