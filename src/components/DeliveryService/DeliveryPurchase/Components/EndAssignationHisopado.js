import React from 'react'
import hisopadosPay from "../../../../assets/img/hisopados_payment.svg"
import {useHistory} from "react-router-dom";
import "../../../../styles/hisopado/hisopadosFlux.scss";

export default function EndAssignationHisopado() {        
    const history = useHistory();

    return (
        <div className="allwhite-hisopados-background" >
            <div className="instructions-container">
                <img src={hisopadosPay} alt="hisopados_tic" className="hisopados_cross"/>
                <p className="hisopados-title">¡Hemos recibido el pago!</p>
                <p>Estamos buscando al profesional más cercano para realizar el hisopado</p>
                <p>¡Puedes cerrar esta ventaan! te enviaremos una notificación cuando un profesional le sea asignado</p>
            <button className="go__home" onClick={() => history.push('/')}>
                Ir a inicio
            </button>
            </div>
        </div>
    )
}
