import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux"
import Info from "./Info"
import Positive from "./Positive"
import Negative from "./Negative"
import { useHistory, useParams } from "react-router-dom"
// import NotService from "../NotService";
// import "../../../styles/hisopado/hisopadosFlux.scss"

export default function HisopadosPurchase() {
    const history = useHistory()
    const { service, docId } = useParams()
    const [result, setResult] = useState('')
    const [fluxTrackerHisopado, setFluxTrackerHisopado] = useState("RESULT_REVEAL");
    const currentServices = useSelector(state => state.services.currentServices)

    useEffect(() => {
        const activeService = service === 'antigeno-domicilio' ? currentServices.delivery : currentServices.onSite;
        const thisService = activeService.filter(service => service.docId === docId)

        console.log(thisService)
    }, [service, docId])

    const renderContent = () => {
        switch (fluxTrackerHisopado) {
            case "RESULT_REVEAL":
                return <Info
                    finalAction={() => setFluxTrackerHisopado(result)} />
            case "POSITIVE":
                return <Positive
                    finalAction={() => history.push("/")} />
            case "NEGATIVE":
                return <Negative
                    history={history}
                    finalAction={() => history.push("/")} />
            default:
                return 
                // return <NotService />
        }
    }

    return (
        <>
            { renderContent() }
        </>
    )
}
