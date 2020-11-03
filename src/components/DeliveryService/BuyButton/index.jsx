import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {useSelector} from 'react-redux';
import '../../../styles/hisopado/delivery.scss';
import ButtonStyle from "./ButtonStyle"

const BuyHisopado = () => {
    const history = useHistory()
    const patient = useSelector((state) => state.queries.patient)
    const id = useSelector((state) => state.deliveryService?.deliveryInfo[0]?.id)
    const deliveryStatus = useSelector((state) => state.deliveryService?.deliveryInfo[0]?.status) || ""

    const buyHisopado = () => {
		window.gtag('event', 'view_promotion', {
            'items': 'Hisopado Antígeno',
            'promotion_id': '1',
            'promotion_name': 'Hisopado',
            'location_id': 'home' 
		  });
        history.push(`/hisopado/${patient.ws}`)
    }

    console.log(deliveryStatus)

    const renderButtonContentFromState = () => {
            switch (deliveryStatus){
                case("PREASSIGN"):
                return <ButtonStyle 
                    title="¡Sigue tu hisopado!" 
                    innerText="Tu profesional se esta preparando." 
                    checkoutText="Ver estado " 
                    finalAction={() => history.push(`/delivery/progress/${patient.ws}/${id}/`)}
                    /> 
                case("ASSIGN:DELIVERY"):
                    return <ButtonStyle 
                    title="¡Sigue tu hisopado!" 
                    innerText="En camino." 
                    checkoutText="Ver estado " 
                    finalAction={() => history.push(`/delivery/progress/${patient.ws}/${id}/`)}
                    /> 
                case("ASSIGN:ARRIVED"):
                    return <ButtonStyle 
                    title="¡Sigue tu hisopado!" 
                    innerText="Tu enfermero/a ha llegado al domicilio." 
                    checkoutText="En domicilio " 
                    finalAction={() => history.push(`/delivery/progress/${patient.ws}/${id}/`)}
                    /> 
                case("DONE:RESULT"):
                    return <ButtonStyle 
                    title="¡Están tus resultados!" 
                    innerText="Mirá el resultado de tu hisopado." 
                    checkoutText="Ver resultado " 
                    finalAction={() => history.push(`/delivery/progress/${patient.ws}/${id}/`)}
                    /> 
                default:
                    return <ButtonStyle 
                    title="¡Hisópate hoy!" 
                    innerText="Hazte tu testeo a domicilio." 
                    checkoutText="Conocer más " 
                    finalAction={() => buyHisopado()} 
                    showPrice={true}/>
    }}
    
    return renderButtonContentFromState()
}

export default BuyHisopado;