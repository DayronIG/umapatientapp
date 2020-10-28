import React from 'react';
import { useSelector } from "react-redux";
import hisopadosTic from "../../../assets/img/hisopados_tic.png"
import hisopadosCross from "../../../assets/img/hisopados_cross.png"

export default function ZoneCoveredHisopado({finalAction}) {
    const { isAddressValidForHisopado } = useSelector(state => state.deliveryService) 

    return (
        <div className="allwhite-hisopados-background">
            {isAddressValidForHisopado? 
            <div className="instructions-container">
                    <img src={hisopadosTic} alt="hisopados_check" className="hisopados_check_cross"/>
                    <p className="hisopados-title">¡Contámos con cobertura en tu zona!</p>
                    <p>Nuestro personal de salud estará en su domicilio en aproximadamente <b>21 minutos.</b></p>
                    <p>Una vez confirmado el pago, le asignaremos un enfermero/a.</p>
                    <div onClick={() => finalAction()} className="blue-button">
                        Continuar con el pago
                    </div>
                    <div onClick={() => console.log("VOLVER")} className="blue-text">
                        Cambiar domicilio
                    </div>
                </div>:
                <div className="instructions-container">
                    <img src={hisopadosCross} alt="hisopados_cross" className="hisopados_check_cross"/>
                    <p className="hisopados-title">¡No contámos con cobertura en tu zona!</p>
                    <p>¿Deseas que te avisemos cuando haya disponibilidad?</p>
                    <p>Te enviaremos una notificación push para avisarte</p>
                    <div onClick={() => console.log("VOLVER")} className="hisopados-button hisopados-blue-background">
                        ¡Sí, quiero!
                    </div>
                </div>}
        </div>
    )
}
