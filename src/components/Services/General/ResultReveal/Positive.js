import React, { useState } from 'react';
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Recomendations from "../../../DeliveryService/DeliveryResults/Components/Recomendations"
import hisopadoPos from "../../../../assets/img/hisopado_pos.svg"
import { FaUserNurse, FaListUl, FaArrowRight, FaStethoscope } from "react-icons/fa"
import { BackButton } from '../../../GeneralComponents/Headers';

export default function PositiveResult({ finalAction }) {
    const history = useHistory();
    const patient = useSelector(state => state.user)
    const discount = useSelector(state => state.deliveryService.params.discount)
    const [recomendations, setRecomendations] = useState(false)

    const goBackButton = () => {
        if (recomendations) {
            return setRecomendations(false)
        } else {
            return history.push("/")
        }

    }

    return (<>
        <BackButton inlineButton={true} customTarget={patient.ws} action={() => goBackButton()} />
        { recomendations ?
            <Recomendations goBack={() => setRecomendations(false)} />
            : <div className="allwhite-hisopados-background" >
                <div className="results-container">
                    <img src={hisopadoPos} alt="hisopado_pos" className="hisopados_res" />
                    <p className="hisopados-title">El resultado de tu hisopado es COVID-detectable</p>
                    <p>¡Cuidá a los tuyos!</p>
                </div>
                {/* <div className="hisopados-flux-results-container">
                    <p className="bold-text">Informale a tus contactos estrechos para que tomen medidas de prevención</p>
                    <div className="blue-button">
                        <a href={`whatsapp://send?text=Hola, he dado positivo en COVID al realizarme un hisopado a domicilio. Te invito a que vos también te realices el hisopado con un 10% de descuento, utilizando el siguiente código: ${discount.code}. Podés además realizar un seguimiento preventivo de tus síntomas ingresando a UMA en el siguiente link https://app.uma-health.com/`} className="link_whatsapp">
                            Informar a mis contactos
                        </a>
                    </div>
                </div> */}
                <div className="results-menu-map-container">
                    <div className="results-menu-map-item" onClick={() => setRecomendations(true)}>
                        <div>
                            <FaListUl className="icon" />
                                Recomendaciones
                            </div>
                        <FaArrowRight className="icon-arrow" />
                    </div>
                    <div className="results-menu-map-item" onClick={() => history.push(`/onlinedoctor/who`)}>
                        <div>
                            <FaUserNurse className="icon" />
                                Quiero una consulta médica
                            </div>
                        <FaArrowRight className="icon-arrow" />
                    </div>
                    <div className="results-menu-map-item" onClick={() => history.push('/umacare')}>
                        <div>
                            <FaStethoscope className="icon" />
                                Seguimiento COVID
                            </div>
                        <FaArrowRight className="icon-arrow" />
                    </div>
                </div>
            </div>}
    </>)
}
