import React, { useState } from 'react';
import { useSelector } from "react-redux";
import { FaHome } from "react-icons/fa"
import hisopadosTic from "../../../assets/img/hisopados_tic.png"
import hisopadosCross from "../../../assets/img/hisopados_cross.png"

export default function ZoneCoveredHisopado({finalAction}) {
    const { isAddressValidForHisopado } = useSelector(state => state.deliveryService) 
    const [showCongrats, setShowCongrats] = useState(false)

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
                    <div onClick={() => console.log("VOLVER")} className="blue-text">
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
                    <div onClick={() => console.log("VOLVER")} className="blue-button">
                        <FaHome className="icon" />
                        Ir al inicio
                    </div>
                    </>
                    :
                    <>
                    <img src={hisopadosCross} alt="hisopados_cross" className="hisopados_cross"/>
                    <p className="hisopados-title">¡Ups!</p>
                    <p>Esta zona aún no cuenta con covertura</p>
                    <p className="map-zone-covered-link">Ver mapa</p>
                    <p>¿Deseas que te avisemos cuando haya disponibilidad?</p>
                    <div onClick={() => setShowCongrats(true)} className="blue-button">
                        ¡Sí, quiero!
                    </div>
                    <div onClick={() => console.log("VOLVER")} className="blue-text">
                        No, no quiero
                    </div>
                    </>
                    }
                </div>}
        </div>
    )
}
