import React from 'react';
import {withRouter} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import amb from '../../../assets/icons/ambulance.png';

const FailedPayment = (props) => {
    return(
        <div className="checkoutresponse-container rejected">
            <div className="checkoutresponse-title rejected">¡Error!</div>
            <div className="checkoutresponse-body">
                <div className="checkoutresponse-description">Ocurrió un problema en el pago, por favor vuelva a intentarlo más tarde o con otro medio de pago.</div>
                <div className="checkoutresponse-image">
                    <img src={amb} alt="Servicio de ambulancias" />
                    <FontAwesomeIcon icon={faTimes} className="checkoutresponse-check" />
                </div>
                <small>{props.error && props.error}</small>
            </div>
            <div className="checkoutresponse-footer rejected">
                <button className="btn back-button" onClick={() => props.history.push(`/`)}>Volver al menú</button>
            </div>
        </div>
    )
}

export default withRouter(FailedPayment);