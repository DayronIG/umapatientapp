import React from 'react';
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import hisopadoPos from "../../../../assets/img/hisopado_pos.svg"
import { FaUserNurse, FaListUl, FaPencilAlt, FaArrowRight, FaHome, FaStethoscope } from "react-icons/fa"

export default function EndAssignationHisopado({finalAction}) {
    const history = useHistory(); 
    const patient = useSelector(state => state.queries.patient)

    return (
        <div className="allwhite-hisopados-background" >
                <div className="results-container">
                    <img src={hisopadoPos} alt="hisopado_pos" className="hisopados_res"/>
                    <p className="hisopados-title">El resultado de tu hisopado es positivo</p>
                    <p>¡Cuidá a los tuyos!</p>
                </div>
            <div className="hisopados-flux-results-container">
                <p className="bold-text">Informale a tus contactos estrechos para que tomen medidas de prevención</p>
                <div onClick={() => finalAction()} className="blue-button">
                    Informar a mis contactos
                </div>
                <p>Ingresando el siguiente código, obtienen un descuento para realizarse el hisopado a domicilio:</p>
                <div className="hisopados-flux-results-code-container">
                    <p className="hisopados-code">COVID-REF</p>
                </div>
                <div className="results-menu-map-container">
                    {/* <div className="results-menu-map-item">
                        <div>
                            <FaUserNurse className="icon" />
                            UMA Care
                        </div>
                        <FaArrowRight className="icon-arrow" />
                    </div> */}
                    {/* <div className="results-menu-map-item">
                        <div>
                            <FaListUl className="icon" />
                            Recomendaciones
                        </div>
                        <FaArrowRight className="icon-arrow" />
                    </div> */}
                    <div className="results-menu-map-item" onClick={() => history.push(`/${patient.ws}/onlinedoctor/who`)}>
                        <div>
                        <FaUserNurse className="icon" />
                            Quiero una consulta médica
                        </div>
                        <FaArrowRight className="icon-arrow" />
                    </div>
                    <div className="results-menu-map-item" onClick={() => history.push(`/${patient.ws}/autonomous`)}>
                        <div>
                        <FaStethoscope className="icon" />
                            Hacer autodiagnóstico
                        </div>
                        <FaArrowRight className="icon-arrow" />
                    </div>
                    <div className="results-menu-map-item" onClick={()=>history.push("/")}>
                        <div>
                            <FaHome className="icon" />
                            Ir al inicio
                        </div>
                        <FaArrowRight className="icon-arrow" />
                    </div>
                </div>
            </div>
        </div>
    )
}
