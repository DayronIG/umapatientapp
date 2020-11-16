import React, {useState, useEffect} from 'react'
import {BackButton} from "../../GeneralComponents/Headers"
import hisopadosNeg from "../../../assets/img/estamos_con_vos.svg"
import { FaClock, FaArrowRight } from "react-icons/fa"
import { GiTransparentTubes } from "react-icons/gi"
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import db from "../../../config/DBConnection";


export default function ListTracker({finalAction}) {
    const history = useHistory(); 
    const patient = useSelector(state => state.queries.patient)
    const purchases = useSelector(state => state.deliveryService.deliveryInfo)
    const dispatch = useDispatch()

    return (
        <div className="allwhite-hisopados-background hisopados-flux delivery-list-tracker" >
                <div className="back-button">
                  <BackButton inlineButton={true} customTarget={patient.ws} action={()=>history.push(`/`)} />
                </div>
                <div className="results-container">
                    <img src={hisopadosNeg} alt="hisopado_neg" className="estamos_con_vos"/>
                    <p className="hisopados-title">Sigue tu hisopado</p>
                </div>
                <div className="results-menu-map-container">
                    {purchases.map( purchase => {
                    let state;  
                    // let action;
                    if (purchase.status === "PREASSIGN"){state="En preparación"}
                    if (purchase.status === "ASSIGN:DELIVERY"){state="En camino"}
                    if (purchase.status === "ASSIGN:ARRIVED"){state="En domicilio"}
                    if (purchase.status === "DONE:RESULT"){state="Ver resultado"}
                    return <div key={purchase.patient.dni} className="results-menu-map-item fit_content_item"
                    onClick={() => console.log("ASD")}>
                        <div>
                            <p className="item_address">{purchase.destination?.user_address.split(",")[0]}</p>
                            <p className="item_status">{state}</p>
                            <p className="item_time"><FaClock className="clock_icon" />Entrega estimada: 1 hora</p>
                        </div>
                        <FaArrowRight className="icon-arrow" />
                    </div>})}
                    
                    <div className="results-menu-map-item highlighted-color"
                        onClick={() => history.push(`/hisopado/${patient.ws}`)}
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
