import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {useSelector} from 'react-redux';
import '../../../styles/hisopado/delivery.scss';
import ButtonStyle from "./ButtonStyle"
import ButtonAllHisopados from "./ButtonAllHisopados"

const BuyHisopado = () => {
    const history = useHistory()
    const patient = useSelector((state) => state.user)
	const currentHisopadoIndex = useSelector(state => state.deliveryService)
    // const id = useSelector((state) => state.deliveryService?.deliveryInfo[0]?.docId)
    const  { params, deliveryInfo } = useSelector((state) => state.deliveryService)
    const [deliveryStatus, setDeliveryStatus] = useState("");

    useEffect(() => {
        deliveryInfo.map(el => {
        if( el.status === "PREASSIGN" || el.status === "IN_PROCESS" || el.status === "ASSIGN:DELIVERY" || el.status === "ASSIGN:ARRIVED" || el.status === "DONE:RESULT"){
            setDeliveryStatus("TRACKING")
        } else if (el.status === "DONE:RESULT" && el.eval.uma_eval === 0){
            setDeliveryStatus("RESULT")
        }
    })
    }, [deliveryInfo])

    const buyHisopado = () => {
		window.gtag('event', 'view_promotion', {
            'items': 'Hisopado Antígeno',
            'promotion_id': '1',
            'promotion_name': 'Hisopado',
            'location_id': 'home' 
		  });
        history.push(`/hisopado/${patient.ws}`)
    }

    const confirmHisopado = () => {
        history.push(`/hisopado/corporate/${patient.ws}`)
    }

    const renderButtonContentFromState = () => {
                if(deliveryStatus === "TRACKING"){
                    return <ButtonAllHisopados innerText="Mis hisopados" finalAction={()=>history.push(`/hisopado/listTracker/${patient.ws}`)} />
                } else if (deliveryStatus === "RESULT"){
                    return <ButtonAllHisopados innerText="Ya tienes tu resultado" finalAction={()=>history.push(`/hisopado/listTracker/${patient.ws}`)} />
                } else {
                    return <ButtonStyle 
                    title="Hisopado a domicilio" 
                    innerText={`¡Pídelo ahora y tienes tu resultado ${params?.delay}!`}
                    checkoutText="Quiero mi hisopado" 
                    finalAction={() => {
                        if (patient.corporate_norm !== 'IOMA') {
                            buyHisopado()
                        } else {
                            confirmHisopado()
                        }
                    }} 
                    showPrice={true}/>
                }

    }
    
    return renderButtonContentFromState()
}

export default BuyHisopado;