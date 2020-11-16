import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux"
import ResultReveal from "./Components/ResultReveal"
import PositiveResult from "./Components/PositiveResult"
import NegativeResult from "./Components/NegativeResult"
import { useHistory } from "react-router-dom"
import NotService from "../NotService";
import "../../../styles/hisopado/hisopadosFlux.scss"

export default function HisopadosPurchase() {
    const [fluxTrackerHisopado, setFluxTrackerHisopado] = useState("RESULT_REVEAL");
    const history = useHistory()
	const {currentHisopadoIndex} = useSelector(state => state.deliveryService)
    const result = useSelector(state => state.deliveryService?.deliveryInfo[currentHisopadoIndex]?.lab?.result_lab)
    const survey = !!useSelector(state => state.deliveryService?.deliveryInfo[currentHisopadoIndex]?.eval?.uma_eval) 

    // useEffect(()=>{
    //     if(survey){
    //         setFluxTrackerHisopado(result)
    //     }
    // }, [survey])

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
          {renderContent()}
        </div>
    )
}
