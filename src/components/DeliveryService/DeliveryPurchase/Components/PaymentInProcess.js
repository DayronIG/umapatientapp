import React from 'react'
import hisopadosPay from "../../../../assets/img/hisopados_payment.svg"
import {useHistory} from "react-router-dom";
import "../../../../styles/hisopado/hisopadosFlux.scss";

export default function PaymentInProcess() {        
    const history = useHistory();

    return (
        <div className="allwhite-hisopados-background" >
            <div className="instructions-container">
                <img src={hisopadosPay} alt="hisopados_tic" className="hisopados_cross"/>
                <p className="hisopados-title">Estamos procesando su pago...</p>
                <p>Mercado Pago aún no ha aprobado tu solicitud de pago. Aguarde unos instantes.</p>
            <button className="go__home" onClick={() => history.push('/home')}>
                Ir a inicio
            </button>
            </div>
        </div>
    )
}
