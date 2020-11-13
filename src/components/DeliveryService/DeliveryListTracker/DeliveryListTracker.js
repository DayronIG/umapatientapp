import React from 'react'
import hisopadosNeg from "../../../assets/img/estamos_con_vos.svg"
import { FaClock, FaArrowRight } from "react-icons/fa"
import { GiTransparentTubes } from "react-icons/gi"
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

export default function ReferredInvitation({finalAction}) {
    const history = useHistory(); 
    const patient = useSelector(state => state.queries.patient)

    return (
        <div className="allwhite-hisopados-background hisopados-flux" >
                <div className="results-container">
                    <img src={hisopadosNeg} alt="hisopado_neg" className="estamos_con_vos"/>
                    <p className="hisopados-title">Sigue tu hisopado</p>
                </div>
                <div className="results-menu-map-container">
                    <div className="results-menu-map-item fit_content_item"
                    onClick={() => console.log("ASD")}>
                        <div>
                            <p className="item_address">Av. Melián 2752</p>
                            <p className="item_status">En camino</p>
                            <p className="item_time"><FaClock className="clock_icon" />Entrega estimada: 1 hora</p>
                        </div>
                        <FaArrowRight className="icon-arrow" />
                    </div>
                    
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
