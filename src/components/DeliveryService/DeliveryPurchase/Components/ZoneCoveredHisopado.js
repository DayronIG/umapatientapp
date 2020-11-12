import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { FaHome } from "react-icons/fa"
import hisopadoTic from "../../../../assets/img/hisopados_tic.svg"
import hisopadoCross from "../../../../assets/img/hisopados_cross.svg"
import markerAddress from "../../../../assets/img/marker_address.svg"
import axios from "axios"
import {mobility_address} from "../../../../config/endpoints"

export default function ZoneCoveredDelivery({ finalAction, history, goPrevious }) {
    const { isAddressValidForHisopado, params } = useSelector(state => state.deliveryService);
    const patient = useSelector(state => state.queries.patient);
    const [showCongrats, setShowCongrats] = useState(false);
    const delivery = useSelector(state => state.deliveryService.params)
    const { piso, depto, address, lat, lng } = useSelector(state => state.deliveryService.selectHomeForm)
    const {id} = useSelector(state => state.deliveryService.current)
    const {hisopadoUserAddress} = useSelector(state => state.deliveryService)

    useEffect(() => {
        if (!isAddressValidForHisopado) {
            window.gtag('event', 'select_content', {
                'content_type': 'OUT_OF_RANGE',
                'item_id': 'Hisopado Antígeno',
            });
        } else {
            window.gtag('event', 'select_content', {
                'content_type': 'IN_RANGE',
                'item_id': 'Hisopado Antígeno',
            });
        }
        if (showCongrats) {
            notifyUserEndpoint()
            window.gtag('event', 'add_to_wishlist', {
                'items': 'Hisopado Antígeno',
                'value': params?.price || '0',
                'currency': 'ARS'
            });
        }
    }, [showCongrats])

    const notifyUserEndpoint = () => {
		const headers = { 'Content-Type': 'Application/json', 'Authorization': localStorage.getItem('token') };
        const data = {
            "key": "HISOPADO",
            "ws": patient.ws,
            "dni": patient.dni,
            "format_address": address,
            "user_address": address,
            "lat": lat,
            "lon": lng,
            "floor": piso,
            "number": depto,
            "incidente_id": id,
            "notify": true
        }
        axios.post(mobility_address, data, {headers})
    }

    return (
        <div className="allwhite-hisopados-background">
            {isAddressValidForHisopado ?
                <div className="instructions-container">
                    <img src={hisopadoTic} alt="delivery_check" className="delivery_check hisopados_check" />
                    <p className="delivery-title">¡Tu hisopado está cada vez mas cerca!</p>
                    <p>Comprando ahora, nuestro personal de salud llegará a tu domicilio en las próximas <b>{delivery.delay}</b></p>
                    <p>El domicilio seleccionado es:</p>
                    <img src={markerAddress} alt="marker_address"/>
                    <br />
                    <p>{hisopadoUserAddress}</p>
                    <p>¿Desea continuar con el pago?</p>
                    <div onClick={() => finalAction()} className="blue-button">
                        Continuar con el pago
                    </div>
                    <div onClick={() => goPrevious()} className="blue-text">
                        Cambiar domicilio
                    </div>
                </div> :
                <div className="instructions-container">
                    {showCongrats ?
                        <>
                            <img src={hisopadoTic} alt="delivery_tic" className="delivery_cross" />
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
                            <img src={hisopadoCross} alt="delivery_cross" className="delivery_cross hisopados_cross" />
                            <p className="delivery-title">¡Ups!</p>
                            <p>Esta zona aún no cuenta con cobertura</p>
                            <p className="map-zone-covered-link" onClick={() => history.push(`/hisopado/cobertura/${patient.ws}`)}>Ver mapa</p>
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