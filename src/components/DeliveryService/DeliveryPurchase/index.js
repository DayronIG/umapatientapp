import React, { useEffect } from 'react';
import {useSelector, useDispatch} from 'react-redux'
import { BackButton, GenericHeader } from '../../GeneralComponents/Headers';
import AskForBuyHisopado from "./Components/AskForBuyHisopado"
import AddressPickerHisopado from "./Components/AddressPickerHisopado"
import ZoneCoveredHisopado from "./Components/ZoneCoveredHisopado"
import { useHistory } from "react-router-dom"
import "../../../styles/hisopado/hisopadosFlux.scss";
import "../../../styles/hisopado/frequentQuestions.scss";

export default function HisopadosPurchase() {
    const { step } = useSelector((state) => state.deliveryService);
    const { ws } = useSelector(state => state.user);
    const history = useHistory()
    const dispatch = useDispatch()

    useEffect(() => {
        window.scroll(0, 0);
    }, [])

    const renderContent = () => {
        // if(!["PREASSING", "ASSIGN:DELIVERY", "ASSIGN:ARRIVED", "DONE:RESULT"].includes(status) ){
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
                default: 
                    return <AskForBuyHisopado />

        }
    }

    const goBackButton = () => {
        switch(step){
            case "ZONE_COVERED":
                return  dispatch({type: 'SET_DELIVERY_STEP', payload: "ADDRESS_PICKER"})
            case "PAYMENT":
                return  dispatch({type: 'SET_DELIVERY_STEP', payload: "ZONE_COVERED"})
            default: 
                return dispatch({type: 'SET_DELIVERY_STEP', payload: "ASK_FOR_BUY"})
        }
    }

    return (
        <div className={`hisopados-flux ${(step === "ADDRESS_PICKER" )? "no-scroll-container": ""}`}>
          {step !== "ASK_FOR_BUY" &&
          (step !== "END_ASSIGNATION" ? 
          <BackButton inlineButton={true} customTarget={ws} action={()=>goBackButton()} />: 
          <GenericHeader children="Hisopados" />)}
          {renderContent()}
        </div>
    )
}
