import React from 'react'
import { FaMapMarker, FaBriefcaseMedical, FaClock, FaCheckCircle, FaCartPlus} from "react-icons/fa"
import IllustrationHisopado from "../../../assets/img/Illustration-Hisopado.png"

export default function AskForBuyHisopado({finalAction}) {
    return (
        <div>
            <img className="hisopados-image" src={IllustrationHisopado} />
            <p className="hisopados-title">¡Comprá tu hisopado a domicilio!</p>
            <p className="hisopados-subtitle">(Sólo disponible en CABA)</p>
            <p className="hisopados-previous-price">$5500</p>
            <p className="hisopados-price">$3499</p>
            <p className="hisopados-discount">40% off</p>
            <div className="hisopados-bullets-container">
            <div className="hisopados-bullets">
                <p><FaMapMarker className="icon"/>A domicilio</p>
                <p><FaBriefcaseMedical className="icon"/>No invasivo</p>
            </div>
            <div className="hisopados-bullets">
                <p><FaCheckCircle className="icon"/>100% efectivo</p>
                <p><FaClock className="icon"/>Resultado en 15´</p>
            </div>
            </div>
            <p>Ahora puedes realizar el hisopado por <br/>COVID-19 desde la comodidad de tu casa.</p>
            <div className="hisopados-flux-container">
                <p className="info-title">¿En qué consiste?</p>
                <p>Es un test rápido de detección del COVID-19, realizado por nuestro personal de salud en el domicilio del cliente. Es una excelente alternativa al hisopado tradicional, económica, indolora y veloz,<br/>¡En solo 15 minutos tenés el resultado!</p>
                <p className="info-title">Medios de pago</p>
                <p>Podés pagarlo con tarjeta de débito, crédito o efectivo.</p>
                <div className="info-warning">
                    <p className="warning-title">Atención: </p>
                    <ul>
                        <li>No emite certificado oficial</li>
                        <li>No sirve para viajar</li>
                        <li>No lo cubre ninguna obra social</li>
                    </ul>
                    </div>
                <p className="info-title">Contacto cercano</p>
                <p>Si sos contacto cercano... 5 días del contacto.</p>
            </div>
            <p className="terms-questions">
                Términos y condiciones
                <br/>
                <br/>
                Preguntas frecuentes
            </p>
            <div onClick={() => finalAction()} className="hisopados-button">
                <p className="button-text"><FaCartPlus className="icon"/>Comprar hisopado</p>
			</div>
        </div>
    )
}
