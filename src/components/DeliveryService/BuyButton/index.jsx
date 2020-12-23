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
    const [deliveryStatus, setDeliveryStatus] = useState(false);

    useEffect(() => {
        deliveryInfo.map(el => {
        if( el.status === "PREASSIGN" || el.status === "IN_PROCESS" || el.status === "ASSIGN:DELIVERY" || el.status === "ASSIGN:ARRIVED" || el.status === "DONE:RESULT"){
            setDeliveryStatus(true)
        }})
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

    const renderButtonContentFromState = () => {
                if(deliveryStatus){
                    return <ButtonAllHisopados finalAction={()=>history.push(`/hisopado/listTracker/${patient.ws}`)} />
                } else {
                    return <ButtonStyle 
                    title="Hisopado a domicilio" 
                    innerText={`¡Pídelo ahora y tienes tu resultado ${params?.delay}!`}
                    checkoutText="Quiero mi hisopado" 
                    finalAction={() => buyHisopado()} 
                    showPrice={true}/>
                }

    }
    
    return renderButtonContentFromState()
}

export default BuyHisopado;