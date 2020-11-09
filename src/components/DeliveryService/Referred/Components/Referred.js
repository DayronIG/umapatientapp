import React from 'react'
import hisopadosNeg from "../../../../assets/img/estamos_con_vos.svg"
import { FaUserNurse, FaHome, FaListUl, FaPencilAlt, FaArrowRight } from "react-icons/fa"
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
                    <p className="hisopados-title">Estamos con vos</p>
                    <p>Si eres contacto estrecho, te recomendamos hacer un seguimiento de tus síntomas</p>
                </div>
                <div className="results-menu-map-container">
                    <div className="results-menu-map-item highlighted-color"
                        onClick={() => history.push(`/hisopado/${patient.ws}`)}
                        >
                        <div>
                            <GiTransparentTubes className="icon" />
                            Comprar hisopado
                        </div>
                        <FaArrowRight className="icon-arrow" />
                    </div>
                    <div className="results-menu-map-item"
                    onClick={() => history.push(`/${patient.ws}/onlinedoctor/who`)}
                    >
                        <div>
                            <FaUserNurse className="icon" />
                            Quiero una consulta médica
                        </div>
                        <FaArrowRight className="icon-arrow" />
                    </div>
                    {/* <div className="results-menu-map-item">
                        <div>
                            <FaListUl className="icon" />
                            Medidas de prevención
                        </div>
                        <FaArrowRight className="icon-arrow" />
                    </div> */}
                    <div className="results-menu-map-item" onClick={()=>history.push(`/${patient.ws}`)}>
                        <div>
                            <FaHome className="icon" />
                                Ir al inicio
                            </div>
                            <FaArrowRight className="icon-arrow" />
                        </div>
                    <div className="results-menu-map-item"
                    onClick={() => history.push(`/${patient.ws}/autonomous`)}
                    >
                        <div>
                            <FaPencilAlt className="icon" />
                            Hacer autodiagnóstico
                        </div>
                        <FaArrowRight className="icon-arrow" />
                    </div>
                </div>
        </div>
    )
}
