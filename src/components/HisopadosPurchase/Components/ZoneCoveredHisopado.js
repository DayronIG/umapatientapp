import React from 'react';
import { useSelector } from "react-redux";

export default function ZoneCoveredHisopado({finalAction}) {
    const { isAddressValidForHisopado } = useSelector(state => state.deliveryService) 

    return (
        <div>
            {isAddressValidForHisopado? 
            <>
                <div className="hisopados-flux-container">
                   <h1>¡Contámos con cobertura en tu zona!</h1>
                   <p>El tiempo de respuesta aproximado es de <b>21 minutos.</b></p>
                </div>
                <div onClick={() => console.log("VOLVER")} className="hisopados-button hisopados-blue-background">
                    Probar otra dirección
                </div>
                <div onClick={() => finalAction()} className="hisopados-button hisopados-blue-color">
                    Contratar Servicio
                </div>
                </>:
                <>
                <div className="hisopados-flux-container">
                   <h1>¡No contámos con cobertura en tu zona!</h1>
                   <p>¿Deseas que te avisemos cuando haya disponibilidad?</p>
                   <p>Te enviaremos una notificación push para avisarte</p>
                </div>
                <div onClick={() => console.log("VOLVER")} className="hisopados-button hisopados-blue-background">
                    ¡Sí, quiero!
                </div>
                </>}
        </div>
    )
}
