import React from 'react'
import hisopadoPos from "../../../../assets/img/hisopado_pos.svg"
import { FaUserNurse, FaListUl, FaPencilAlt, FaArrowRight } from "react-icons/fa"

export default function EndAssignationHisopado({finalAction}) {

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
        </div>
    )
}
