import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { FaHome } from "react-icons/fa"
import hisopadosTic from "../../../assets/img/hisopados_tic.svg"
import hisopadosCross from "../../../assets/img/hisopados_cross.svg"

export default function ZoneCoveredHisopado({finalAction, history, goPrevious}) {
    const { isAddressValidForHisopado } = useSelector(state => state.deliveryService);
    const { ws } = useSelector(state => state.queries.patient); 
    const [showCongrats, setShowCongrats] = useState(false);

    useEffect(()=>{
        if(showCongrats){
            //SUSCRIBIR A AVISOS
        }
    },[showCongrats])

    return (
        <div className="allwhite-hisopados-background">
            {isAddressValidForHisopado? 
            <div className="instructions-container">
                    <img src={hisopadosTic} alt="hisopados_check" className="hisopados_check"/>
                    <p className="hisopados-title">¡Contámos con cobertura en tu zona!</p>
                    <p>Nuestro personal de salud estará en su domicilio en aproximadamente <b>21 minutos.</b></p>
                    <p>Una vez confirmado el pago, le asignaremos un enfermero/a.</p>
                    <div onClick={() => finalAction()} className="blue-button">
                        Continuar con el pago
                    </div>
                    <div onClick={() => goPrevious()} className="blue-text">
                        Cambiar domicilio
                    </div>
                </div>:
                <div className="instructions-container">
                    {showCongrats ? 
                    <>
                    <img src={hisopadosTic} alt="hisopados_tic" className="hisopados_cross"/>
                    <p className="hisopados-title">¡Felicitaciones!</p>
                    <p>Hemos recibido su solicitud</p>
                    <p>Te enviaremos una notificación cuando se habiliten nuevas zonas</p>
                    <div onClick={() => history.push("/")} className="blue-button">
                        <FaHome className="icon" />
                        Ir al inicio
                    </div>
                    </>
                    :
                    <>
                    <img src={hisopadosCross} alt="hisopados_cross" className="hisopados_cross"/>
                    <p className="hisopados-title">¡Ups!</p>
                    <p>Esta zona aún no cuenta con covertura</p>
                    <p className="map-zone-covered-link" onClick={() => history.push(`/${ws}/hisopado/cobertura`)}>Ver mapa</p>
                    <p>¿Deseas que te avisemos cuando haya disponibilidad?</p>
                    <div onClick={() => setShowCongrats(true)} className="blue-button">
                        ¡Sí, quiero!
                    </div>
                    <div onClick={() => goPrevious()} className="blue-text">
                        Probar otro domicilio
                    </div>
                    </>
                    }
                </div>}
        </div>
    )
}
