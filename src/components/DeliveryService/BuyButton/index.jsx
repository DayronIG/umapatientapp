import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {useSelector} from 'react-redux';
import '../../../styles/hisopado/delivery.scss';
import ButtonStyle from "./ButtonStyle"
import ButtonAllHisopados from "./ButtonAllHisopados"

const BuyHisopado = () => {
    const history = useHistory()
    const patient = useSelector((state) => state.queries.patient)
    const {deliveryInfo} = useSelector((state) => state.deliveryService)
    const id = useSelector((state) => state.deliveryService?.deliveryInfo[0]?.docId)
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

    const renderButtonContentFromState = () => {
            switch (deliveryStatus){
                case("PREASSIGN"):
                case("ASSIGN:DELIVERY"):
                case("ASSIGN:ARRIVED"):
                case("RESULT:DONE"):
                    return <ButtonAllHisopados finalAction={()=>history.push(`/hisopado/listTracker/${patient.ws}`)} />
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