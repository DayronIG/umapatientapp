import React from 'react'
import { BackButton } from "../../../GeneralComponents/Headers"
import hisopadosNeg from "../../../../assets/img/estamos_con_vos.svg"
import { FaArrowRight } from "react-icons/fa"
import { GiTransparentTubes } from "react-icons/gi"
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

export default function ListTracker({ finalAction }) {
    const history = useHistory()
    const dispatch = useDispatch()
    const { currentHisopadoIndex } = useSelector(state => state.deliveryService)
    const deliveryId = useSelector((state) => state.services?.currentServices?.delivery[currentHisopadoIndex]?.docId)
    const deliveryNurseEval = useSelector(state => state.services?.currentServices?.delivery[currentHisopadoIndex]?.eval?.nurse_eval)
    const deliveryPurchases = useSelector(state => state.services?.currentServices?.delivery)
    const deliveryStatus = useSelector((state) => state.services?.currentServices?.delivery[currentHisopadoIndex]?.status)
    const deliveryUmaEval = useSelector(state => state.services?.currentServices?.delivery[currentHisopadoIndex]?.eval?.uma_eval)
    const onSiteId = useSelector((state) => state.services?.currentServices?.onSite[currentHisopadoIndex]?.docId)
    const onSitePurchases = useSelector(state => state.services?.currentServices?.onSite)
    const onSiteStatus = useSelector((state) => state.services?.currentServices?.onSite[currentHisopadoIndex]?.status)
    const patient = useSelector(state => state.user)

    const handleDeliveryDerivation = (index) => {
        dispatch({ type: "SET_HISOPADO_INDEX", payload: index })
        switch (deliveryPurchases[index].status) {
            case ("PREASSIGN"):
            case ("IN_PROCESS"):
            case ("ASSIGN:DELIVERY"):
            case ("ASSIGN:ARRIVED"):
                return history.push(`/delivery/progress/${patient.ws}/${deliveryId}/`);
            case ("DONE:RESULT"): {
                if (deliveryStatus === 'DONE:RESULT' && deliveryNurseEval && deliveryUmaEval) {
                    return history.push(`/hisopadoResult/${patient.ws}/`);
                } else {
                    return history.push(`/delivery/progress/${patient.ws}/${deliveryId}/`);
                }
            }
            default:
                history.push(`/hisopado/${patient.ws}`)
        }
    }

    const handleOnSiteDerivation = (index) => {
        switch (deliveryPurchases[index].status) {
            case ("PAYMENT"):
                return history.push(`/delivery/progress/${patient.ws}/${deliveryId}/`);
            case ("DONE:RESULT"): {
                if (onSiteStatus === 'DONE:RESULT') {
                    return history.push(`/hisopadoResult/${patient.ws}/`);
                } else {
                    return history.push(`/delivery/progress/${patient.ws}/${deliveryId}/`);
                }
            }
            default:
                history.push(`/hisopado/${patient.ws}`)
        }
    }

    return (
        <div className="allwhite-hisopados-background hisopados-flux delivery-list-tracker" >
            <div className="back-button">
                <BackButton customTarget={patient.ws} action={() => history.push(`/`)} />
            </div>
            <div className="results-container">
                <img src={hisopadosNeg} alt="hisopado_neg" className="estamos_con_vos" />
                <p className="hisopados-title">Servicios activos</p>
            </div>
            <div className="results-menu-map-container">
                {onSitePurchases.map((purchase, index) => {
                    if (!["FREE"].includes(purchase.status)) {
                        let state;
                        if (purchase.status === "PAYMENT" && purchase.payment.status === "PAYMENT:SUCCESS") { state = "El pago fue procesado correctamente" }
                        if (purchase.status === "PAYMENT" && purchase.payment.status === "PAYMENT:REJECTED") { state = "El pago fue rechazado" }
                        if (purchase.status === "DONE:RESULT") { state = "Ver resultado" }
                        return <div key={`${purchase.patient?.dni}_${index}`} className="results-menu-map-item fit_content_item"
                            onClick={() => handleOnSiteDerivation(index)}>
                            <div>
                                <p className="item_address">{purchase.patient.fullname}</p>
                                <p className="item_address">{purchase.service}</p>
                                <p className="item_status">{state}</p>
                            </div>
                            {state !== "En preparación" && <FaArrowRight className="icon-arrow" />}
                        </div>
                    }
                })}

                {deliveryPurchases.map((purchase, index) => {
                    if (!["FREE", "FREE:IN_RANGE", "DEPENDANT"].includes(purchase.status)) {
                        let state;
                        if (purchase.status === "PREASSIGN") { state = "En preparación" }
                        if (purchase.status === "IN_PROCESS") { state = "Procesando pago" }
                        if (purchase.status === "ASSIGN:DELIVERY") { state = "En camino" }
                        if (purchase.status === "ASSIGN:ARRIVED") { state = "En domicilio" }
                        if (purchase.status === "DONE:RESULT") { state = "Ver resultado" }
                        return <div key={`${purchase.patient?.dni}_${index}`} className="results-menu-map-item fit_content_item"
                            onClick={() => handleDeliveryDerivation(index)}>
                            <div>
                                <p className="item_address">{purchase.patient.user}</p>
                                <p className="item_address">{purchase.service === 'HISOPADO' ? 'Antígeno a domicilio' : purchase.service}</p>
                                <p className="item_address">{purchase.destination?.user_address.split(",")[0]}</p>
                                <p className="item_status">{state}</p>
                            </div>
                            {state !== "En preparación" && <FaArrowRight className="icon-arrow" />}
                        </div>
                    }
                })}

                {/* <div className="results-menu-map-item highlighted-color"
                    onClick={() => {
                        dispatch({ type: "SET_DELIVERY_STEP", payload: "ASK_FOR_BUY" })
                        history.push(`/hisopado/${patient.ws}`)
                    }}
                >
                    <div>
                        <GiTransparentTubes className="icon" />
                            Comprar hisopado
                        </div>
                    <FaArrowRight className="icon-arrow" />
                </div> */}
            </div>
        </div>
    )
}
