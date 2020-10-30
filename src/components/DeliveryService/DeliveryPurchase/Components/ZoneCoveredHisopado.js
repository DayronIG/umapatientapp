import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { FaHome } from "react-icons/fa"
import hisopadoTic from "../../../../assets/img/hisopado_tic.svg"
import hisopadoCross from "../../../../assets/img/hisopado_cross.svg"

export default function ZoneCoveredDelivery({finalAction, history, goPrevious}) {
    const { isAddressValidForDelivery } = useSelector(state => state.deliveryService);
    const { ws } = useSelector(state => state.queries.patient); 
    const [showCongrats, setShowCongrats] = useState(false);

    useEffect(()=>{
        if(showCongrats){
            //SUSCRIBIR A AVISOS
        }
    },[showCongrats])

    return (
        <div className="allwhite-delivery-background">
            {isAddressValidForDelivery? 
            <div className="instructions-container">
                    <img src={hisopadoTic} alt="delivery_check" className="delivery_check"/>
                    <p className="delivery-title">¡Contámos con cobertura en tu zona!</p>
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
                    <img src={hisopadoTic} alt="delivery_tic" className="delivery_cross"/>
                    <p className="delivery-title">¡Felicitaciones!</p>
                    <p>Hemos recibido su solicitud</p>
                    <p>Te enviaremos una notificación cuando se habiliten nuevas zonas</p>
                    <div onClick={() => history.push("/")} className="blue-button">
                        <FaHome className="icon" />
                        Ir al inicio
                    </div>
                    </>
                    :
                    <>
                    <img src={hisopadoCross} alt="delivery_cross" className="delivery_cross"/>
                    <p className="delivery-title">¡Ups!</p>
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
