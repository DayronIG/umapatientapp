import React from 'react'
import {BackButton} from "../../GeneralComponents/Headers"
import hisopadosNeg from "../../../assets/img/estamos_con_vos.svg"
import { FaArrowRight } from "react-icons/fa"
import { GiTransparentTubes } from "react-icons/gi"
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

export default function ListTracker({finalAction}) {
    const history = useHistory(); 
    const patient = useSelector(state => state.user)
    const {currentHisopadoIndex} = useSelector(state => state.deliveryService)
    const purchases = useSelector(state => state.deliveryService.deliveryInfo)
    const id = useSelector((state) => state.deliveryService?.deliveryInfo[currentHisopadoIndex]?.docId);
    const status = useSelector((state) => state.deliveryService?.deliveryInfo[currentHisopadoIndex]?.status);
    const nurse_eval = useSelector(state => state.deliveryService?.deliveryInfo[currentHisopadoIndex]?.eval?.nurse_eval);
    const uma_eval = useSelector(state => state.deliveryService?.deliveryInfo[currentHisopadoIndex]?.eval?.uma_eval);
    const dispatch = useDispatch();

    const handleDerivation = (index) => {
        dispatch({type: "SET_HISOPADO_INDEX", payload: index})
        switch(purchases[index].status){
            case("PREASSIGN"):
            case("ASSIGN:DELIVERY"):
            case("ASSIGN:ARRIVED"):
                return history.push(`/delivery/progress/${patient.ws}/${id}/`);
            case("DONE:RESULT"): {
                if(status === 'DONE:RESULT' && nurse_eval && uma_eval){
                    return history.push(`/hisopadoResult/${patient.ws}/`);
                } else {
                    return history.push(`/delivery/progress/${patient.ws}/${id}/`);
                }
            }
            default:
                history.push(`/hisopado/${patient.ws}`)
        }
    }

    return (
        <div className="allwhite-hisopados-background hisopados-flux delivery-list-tracker" >
                <div className="back-button">
                  <BackButton inlineButton={true} customTarget={patient.ws} action={()=>history.push(`/`)} />
                </div>
                <div className="results-container">
                    <img src={hisopadosNeg} alt="hisopado_neg" className="estamos_con_vos"/>
                    <p className="hisopados-title">Sigue tus hisopados</p>
                </div>
                <div className="results-menu-map-container">
                    {purchases.map((purchase, index) => {
                    if(!["FREE", "FREE:IN_RANGE", "DEPENDANT"].includes(purchase.status)){let state;  
                    if (purchase.status === "PREASSIGN"){state="En preparación"}
                    if (purchase.status === "ASSIGN:DELIVERY"){state="En camino"}
                    if (purchase.status === "ASSIGN:ARRIVED"){state="En domicilio"}
                    if (purchase.status === "DONE:RESULT"){state="Ver resultado"}
                    return <div key={purchase.patient?.dni} className="results-menu-map-item fit_content_item"
                    onClick={() => handleDerivation(index)}>
                        <div>
                            <p className="item_address">{purchase.destination?.user_address.split(",")[0]}</p>
                            <p className="item_status">{state}</p>
                        </div>
                        {state !== "En preparación" && <FaArrowRight className="icon-arrow" />}
                    </div>}})}
                    
                    <div className="results-menu-map-item highlighted-color"
                        onClick={() => history.push(`/hisopado/carrito/${patient.ws}`)}
                        >
                        <div>
                            <GiTransparentTubes className="icon" />
                            Comprar hisopado
                        </div>
                        <FaArrowRight className="icon-arrow" />
                    </div>
                </div>
        </div>
    )
}
