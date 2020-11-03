import React from 'react'
import { useSelector } from "react-redux";
import hisopadosNeg from "../../../../assets/img/hisopado_neg.svg"
import { FaUserNurse, FaListUl, FaPencilAlt, FaArrowRight } from "react-icons/fa"
import { useHistory } from "react-router-dom"

export default function EndAssignationHisopado({finalAction}) {
    const history = useHistory(); 
    const patient = useSelector(state => state.queries.patient)

    return (
        <div className="allwhite-hisopados-background" >
                <div className="results-container">
                    <img src={hisopadosNeg} alt="hisopado_neg" className="hisopados_res"/>
                    <p className="hisopados-title">El resultado de tu hisopado es negativo</p>
                    <p>¡Seguí cuidandote!</p>
                    <p>¿Deseas consultar con un médico?</p>
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
                            Medidas de prevención
                        </div>
                        <FaArrowRight className="icon-arrow" />
                    </div> */}
                </div>
        </div>
    )
}
