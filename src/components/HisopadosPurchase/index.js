import React, { useState, useEffect } from 'react'
import { GenericHeader } from '../GeneralComponents/Headers';
import AskForBuyHisopado from "./Components/AskForBuyHisopado"
import AddressPickerHisopado from "./Components/AddressPickerHisopado"
import ZoneCoveredHisopado from "./Components/ZoneCoveredHisopado"
import ConfirmationHisopado from "./Components/ConfirmationHisopado"
import EndAssignationHisopado from "./Components/EndAssignationHisopado"
import Payment from "../Payment"
import "./hisopadosFlux.scss"

export default function HisopadosPurchase() {
    const [fluxTrackerHisopado, setFluxTrackerHisopado] = useState("ASK_FOR_BUY");

    const renderContent = () => {
        switch (fluxTrackerHisopado) {
            case "ASK_FOR_BUY":
                return <AskForBuyHisopado 
                finalAction = {() => setFluxTrackerHisopado("ADDRESS_PICKER")}/>
            case "ADDRESS_PICKER":
                return <AddressPickerHisopado 
                finalAction = {() => setFluxTrackerHisopado("ZONE_COVERED")}/>
            case "ZONE_COVERED":
                return <ZoneCoveredHisopado 
                finalAction = {() => setFluxTrackerHisopado("CONFIRMATION")}/>
            case "CONFIRMATION":
                return <ConfirmationHisopado 
                finalAction = {() => setFluxTrackerHisopado("PAYMENT")}/>
            case "PAYMENT":
                return <Payment 
                finalAction = {() => setFluxTrackerHisopado("END_ASSIGNATION")}/>
            case "END_ASSIGNATION":
                return <EndAssignationHisopado 
                finalAction = {() => console.log("REDIRECT TO TRACKER")}/>
            default: 
                console.log("ALGO")
    }}

    return (
        <div className="hisopados-flux">
          <GenericHeader children="Contratar Hisopado" />
          {renderContent()}
        </div>
    )
}
