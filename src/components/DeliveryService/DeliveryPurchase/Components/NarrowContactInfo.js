import React from 'react'
import { useSelector } from "react-redux";
import narrowContact from "../../../../assets/img/narrow-contact.svg"
import { FaUserNurse, FaListUl, FaPencilAlt, FaArrowRight, FaHome, FaStethoscope } from "react-icons/fa"
import { useHistory } from "react-router-dom"

export default function NegativeResult({goBack}) {
    const history = useHistory(); 
    const patient = useSelector(state => state.queries.patient)

    return (
        <div className="allwhite-hisopados-background" >
                <div className="narrow__contact__container">
                    <img src={narrowContact} alt="hisopado_neg" className="narrow__image"/>
                    <p className="hisopados-title">¿Soy contacto estrecho?</p>
                    <p>Para ser un contacto estrecho, tenés que haber pasado más de 15 minutos, a menos de dos metros de distancia, dentro de las 48 hs previas al inicio de los síntomas de un caso probable o confirmado de Coronavirus sin haber cumplido distancia social (2 metros) y sin tapabocas.</p>                   
                    <p className="warning">Atención: </p>
                    <p>Es importante que te hagas el test a los <u><b>5 días</b></u> del contacto si aún no tienes síntomas</p>
                    <p>Si presentas síntomas, y has tenido contacto con un paciente confirmado o sospechoso de COVID positivo, debes hisoparte inmediatamente.</p>               
                    <div onClick={() => goBack()} className="blue-text">
                        Volver
                    </div>
                </div>
        </div>
    )
}
