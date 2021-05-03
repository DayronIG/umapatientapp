import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux"
import Info from "./Info"
import Positive from "./Positive"
import Negative from "./Negative"
import { useHistory, useParams } from "react-router-dom"
import NotService from "../../../DeliveryService/NotService";
// import "../../../styles/hisopado/hisopadosFlux.scss"

export default function HisopadosPurchase() {
    const history = useHistory()
    const { service, docId } = useParams()
    const [result, setResult] = useState('')
    const [fluxTrackerHisopado, setFluxTrackerHisopado] = useState("RESULT_REVEAL");
    const currentServices = useSelector(state => state.services.currentServices)
    const [constancyData, setConstancyData] = useState({})
    
    useEffect(() => {
        const activeService = service === 'antigeno-domicilio' ? currentServices.delivery : currentServices.onSite;
        const thisService = activeService.filter(service => service.docId === docId)

        setResult(thisService[0]?.lab?.result_lab)
        setConstancyData({
            patient: thisService[0]?.patient, 
            id: thisService[0]?.docId, 
            lab: thisService[0]?.lab, 
            service: thisService[0]?.service, 
            dt_cierre: thisService[0]?.dt_cierre
        })
    }, [service, docId, currentServices])

    const renderContent = () => {
        switch (fluxTrackerHisopado) {
            case "RESULT_REVEAL":
                return <Info
                    constancy={constancyData}
                    finalAction={() => setFluxTrackerHisopado(result)} />
            case "POSITIVE":
                return <Positive
                    finalAction={() => history.push("/")} />
            case "NEGATIVE":
                return <Negative
                    history={history}
                    finalAction={() => history.push("/")} />
            default:
                return <NotService />
        }
    }

    return (
        <div className={`hisopados-flux ${(fluxTrackerHisopado === "ADDRESS_PICKER") ? "no-scroll-container" : ""}`}>
            { renderContent() }
        </div>
    )
}
