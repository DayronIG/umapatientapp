import React, { useEffect } from 'react'
import {useSelector} from "react-redux"
import hisopadosPay from "../../../../assets/img/hisopados_payment.svg"
import { Loader } from '../../../GeneralComponents/Loading';
import {useHistory} from "react-router-dom";
import "../../../../styles/hisopado/hisopadosFlux.scss";

export default function EndAssignationHisopado() {        
    return (
        <div className="allwhite-hisopados-background" >
            <div className="instructions-container">
                <img src={hisopadosPay} alt="hisopados_tic" className="hisopados_cross"/>
                <p className="hisopados-title">¡Hemos recibido su pago!</p>
                <p>Estamos buscando al profesional más cercano para realizar el hisopado</p>
                <p>Aguarde unos instantes</p>
            </div>
        </div>
    )
}
