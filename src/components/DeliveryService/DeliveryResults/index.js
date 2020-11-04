import React, { useState } from 'react'
import { useSelector } from "react-redux"
import { GenericHeader } from '../../GeneralComponents/Headers';
import ResultReveal from "./Components/ResultReveal"
import PositiveResult from "./Components/PositiveResult"
import NegativeResult from "./Components/NegativeResult"
import { useHistory } from "react-router-dom"
import NotService from "../NotService";
import "../../../styles/hisopado/hisopadosFlux.scss"

export default function HisopadosPurchase() {
    const [fluxTrackerHisopado, setFluxTrackerHisopado] = useState("RESULT_REVEAL");
    const history = useHistory()
    const result = useSelector(state => state.deliveryService?.deliveryInfo[0]?.lab?.result_lab)

    const renderContent = () => {
        switch (fluxTrackerHisopado) {
            case "RESULT_REVEAL":
                return <ResultReveal 
                finalAction = {() => setFluxTrackerHisopado(result)}/>
            case "POSITIVE":
                return <PositiveResult 
                finalAction = {() => history.push("/")}/>
            case "NEGATIVE":
                return <NegativeResult 
                history={history}
                finalAction = {() => history.push("/")}/>
            default: 
                return <NotService />
    }}

    return (
        <div className={`hisopados-flux ${(fluxTrackerHisopado === "ADDRESS_PICKER" )? "no-scroll-container": ""}`}>
          <GenericHeader children="Resultado Hisopado" />
          {renderContent()}
        </div>
    )
}
