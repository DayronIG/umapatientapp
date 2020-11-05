import React from 'react';
import {useSelector, useDispatch} from 'react-redux'
import { BackButton, GenericHeader } from '../../GeneralComponents/Headers';
import AskForBuyHisopado from "./Components/AskForBuyHisopado"
import AddressPickerHisopado from "./Components/AddressPickerHisopado"
import ZoneCoveredHisopado from "./Components/ZoneCoveredHisopado"
import Payment from "../../Payment"
import DeliveryTrackProgress from '../DeliveryTrackProgress';
import { useHistory } from "react-router-dom"
import "../../../styles/hisopado/hisopadosFlux.scss";
import "../../../styles/hisopado/frequentQuestions.scss";

export default function HisopadosPurchase() {
    const {step, params} = useSelector((state) => state.deliveryService);
    const { ws } = useSelector(state => state.queries.patient);
    const { id } = useSelector(state => state.deliveryService.current);

    const history = useHistory()
    const dispatch = useDispatch()

    const renderContent = () => {
        switch (step) {
            case "ASK_FOR_BUY":
                window.gtag('event', 'select_content', {
                    'content_type': 'ASK_FOR_BUY',
                    'item_id': 'Hisopado Antígeno',
                  });
                return <AskForBuyHisopado />
            case "ADDRESS_PICKER":
                window.gtag('event', 'select_content', {
                    'content_type': 'ADDRESS_PICKER',
                    'item_id': 'Hisopado Antígeno',
                  });
                return <AddressPickerHisopado />
            case "ZONE_COVERED":
                return <ZoneCoveredHisopado 
                history={history}
                goPrevious = {() => dispatch({type: 'SET_DELIVERY_STEP', payload: "ADDRESS_PICKER"})}
                finalAction = {() => dispatch({type: 'SET_DELIVERY_STEP', payload: "PAYMENT"})}/>
            case "PAYMENT":
                window.gtag('event', 'begin_checkout', {
                    'items': 'Hisopado Antígeno',
                    'currency': 'ARS',
                    'value': params?.price
                  });
                return <Payment />
            case "END_ASSIGNATION":
                window.gtag('event', 'select_content', {
                    'content_type': 'END_ASSIGNATION',
                    'item_id': 'Hisopado Antígeno',
                  });
                history.push(`/delivery/progress/${ws}/${id}/`);
            break;
            default: 
                console.log("ALGO")
    }}

    const goBackButton = () => {
        switch(step){
            case "ASK_FOR_BUY":
                return history.push("/")
            case "ADDRESS_PICKER":
                return dispatch({type: 'SET_DELIVERY_STEP', payload: "ASK_FOR_BUY"})        
            case "ZONE_COVERED":
                return  dispatch({type: 'SET_DELIVERY_STEP', payload: "ADDRESS_PICKER"})
            case "PAYMENT":
                return  dispatch({type: 'SET_DELIVERY_STEP', payload: "ZONE_COVERED"})           
            default: 
                console.log("ALGO")
        }
    }

    return (
        <div className={`hisopados-flux ${(step === "ADDRESS_PICKER" )? "no-scroll-container": ""}`}>
          {step !== "END_ASSIGNATION"? <BackButton inlineButton={true} customTarget={ws} action={()=>goBackButton()} />: <GenericHeader children="Hisopados" />}
          {renderContent()}
        </div>
    )
}
