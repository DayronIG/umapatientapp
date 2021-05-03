import React from 'react'
import { useSelector } from "react-redux";
import hisopadosNeg from "../../../../assets/img/hisopado_neg.svg"
import { FaUserNurse, FaListUl, FaPencilAlt, FaArrowRight, FaHome, FaStethoscope } from "react-icons/fa"
import { useHistory } from "react-router-dom"
import { BackButton } from '../../../GeneralComponents/Headers';

export default function NegativeResult({ finalAction }) {
    const history = useHistory();
    const patient = useSelector(state => state.user)
    const goBackButton = () => {
        return history.push("/")
    }

    return (
        <>
            <BackButton inlineButton={true} customTarget={patient.ws} action={() => goBackButton()} />
            <div className="allwhite-hisopados-background" >
                <div className="results-container">
                    <img src={hisopadosNeg} alt="hisopado_neg" className="hisopados_res" />
                    <p className="hisopados-title">El resultado de tu hisopado es COVID-no detectable</p>
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
                    <div className="results-menu-map-item" onClick={() => history.push(`/onlinedoctor/who`)}>
                        <div>
                            <FaUserNurse className="icon" />
                            Quiero una consulta médica
                        </div>
                        <FaArrowRight className="icon-arrow" />
                    </div>
                    <div className="results-menu-map-item" onClick={() => history.push(`/autonomous/${patient.ws}`)}>
                        <div>
                            <FaStethoscope className="icon" />
                            Hacer autodiagnóstico
                        </div>
                        <FaArrowRight className="icon-arrow" />
                    </div>
                    {/* <div className="results-menu-map-item" onClick={()=>history.push("/")}>
                        <div>
                            <FaHome className="icon" />
                            Ir al inicio
                        </div>
                        <FaArrowRight className="icon-arrow" />
                    </div> */}
                </div>
            </div>
        </>
    )
}
