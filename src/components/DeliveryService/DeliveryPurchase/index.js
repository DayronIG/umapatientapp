import React from 'react';
import {useSelector, useDispatch} from 'react-redux'
import { GenericHeader } from '../../GeneralComponents/Headers';
import AskForBuyHisopado from "./Components/AskForBuyHisopado"
import AddressPickerHisopado from "./Components/AddressPickerHisopado"
import ZoneCoveredHisopado from "./Components/ZoneCoveredHisopado"
import EndAssignationHisopado from "./Components/EndAssignationHisopado"
import Payment from "../../Payment"
import { useHistory } from "react-router-dom"
import "../../../styles/hisopado/hisopadosFlux.scss"
import "../../../styles/hisopado/frequentQuestions.scss";

export default function HisopadosPurchase() {
    const {step, params} = useSelector((state) => state.deliveryService.step);

    const history = useHistory()
    const dispatch = useDispatch()

    const renderContent = () => {
        switch (step) {
            case "ASK_FOR_BUY":
                return <AskForBuyHisopado />
            case "ADDRESS_PICKER":
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
                return <EndAssignationHisopado 
                history={history}
                finalAction = {() => console.log("REDIRECT TO TRACKER")}/>
            default: 
                console.log("ALGO")
    }}

    return (
        <div className={`hisopados-flux ${(step === "ADDRESS_PICKER" )? "no-scroll-container": ""}`}>
          <GenericHeader children="Hisopado" />
          {renderContent()}
        </div>
    )
}
