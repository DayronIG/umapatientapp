import React from 'react'
import hisopadosNeg from "../../../../assets/img/hisopado_neg.svg"
import { FaUserNurse, FaListUl, FaPencilAlt, FaArrowRight } from "react-icons/fa"

export default function EndAssignationHisopado({finalAction}) {

    return (
        <div className="allwhite-hisopados-background" >
                <div className="results-container">
                    <img src={hisopadosNeg} alt="hisopado_neg" className="hisopados_res"/>
                    <p className="hisopados-title">El resultado de tu hisopado es negativo</p>
                    <p>¡Seguí cuidandote!</p>
                    <p>¿Deseas consultar con un médico?</p>
                </div>
                <div className="results-menu-map-container">
                    <div className="results-menu-map-item">
                        <div>
                            <FaUserNurse className="icon" />
                            UMA Care
                        </div>
                        <FaArrowRight className="icon-arrow" />
                    </div>
                    <div className="results-menu-map-item">
                        <div>
                            <FaListUl className="icon" />
                            Recomendaciones
                        </div>
                        <FaArrowRight className="icon-arrow" />
                    </div>
                    <div className="results-menu-map-item">
                        <div>
                            <FaPencilAlt className="icon" />
                            Encuesta de satisfacción
                        </div>
                        <FaArrowRight className="icon-arrow" />
                    </div>
                </div>
        </div>
    )
}
