import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { FaMapMarker, FaBriefcaseMedical, FaClock, FaCheckCircle, FaCartPlus} from "react-icons/fa"
import TermsConditions from "./TermsConditions"
import FrequentQuestions from "./FrequentQuestions"
import IllustrationHisopado from "../../../../assets/img/Illustration-Hisopado.png"
import axios from 'axios';
import {create_delivery, config} from '../../../../config/endpoints';
import db from "../../../../config/DBConnection";
import swal from 'sweetalert';

export default function AskForBuyHisopado() {
    const [termsConditions, setTermsConditions] = useState(false)
    const [frequentQuestions, setFrequentQuestions] = useState(false)
    const {params, current} = useSelector(state => state.deliveryService)
    const patient = useSelector(state => state.queries.patient)
    const dispatch = useDispatch()

    useEffect(() => {
        if(patient.dni) {
            getCurrentService()
        }
    }, [patient])

    const getCurrentService = () => {
        db.firestore().collection('events/requests/delivery')
        .where('patient.dni', '==', patient.dni)
        .where('status', 'in', ['FREE', 'FREE:IN_RANGE'])
        .get()
        .then(res => {
            res.forEach(services => {
                let document = {...services.data(), id: services.id}
                dispatch({type: 'SET_DELIVERY_CURRENT', payload: document})
            })
        })
    }

    const startBuying = async () => {
        window.gtag('event', 'select_item', {
            'item_list_name': 'Hisopado Antígeno'
          });
        if(!current?.status) {
            let data = {
                dni: patient.dni,
                service: 'HISOPADO'
            }
            await axios.post(create_delivery, data, config)
                .then(async res => {
                    await getCurrentService()
                    dispatch({type: 'SET_DELIVERY_STEP', payload: "ADDRESS_PICKER"})
                })
                .catch(err => swal("Error", `No pudimos acceder al servicio en este momento. ${JSON.stringify(err.message)}`, "warning"))
        } else {
            dispatch({type: 'SET_DELIVERY_STEP', payload: "ADDRESS_PICKER"})
        }
    }

    const renderContent = () => {
        if(termsConditions){
            return <TermsConditions goBack={() => setTermsConditions(false)} />
        } else if (frequentQuestions) {
            return <FrequentQuestions goBack={() => setFrequentQuestions(false)}/>
        } else {
            return (
            <div>
            <img className="hisopados-image" src={IllustrationHisopado}  alt="Hisopado" />
            <p className="hisopados-title">¡Comprá tu hisopado a domicilio!</p>
            <p className="hisopados-subtitle">(Sólo disponible en CABA)</p>
            <div className="price-container">
            <p className="hisopados-previous-price">$5500</p>
                <p className="hisopados-discount">40% off</p>
            </div>
                <p className="hisopados-price">${params?.price}</p>
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
                <br/>
                <p className="info-title">Contacto cercano</p>
                <p>Si sos contacto cercano... 5 días del contacto.</p>
            </div>
            <p className="terms-questions">
                <span onClick={()=>setTermsConditions(true)}>Términos y condiciones</span>
                <br/>
                <br/>
                <span onClick={()=>setFrequentQuestions(true)}>Preguntas frecuentes</span>
            </p>
            <div onClick={() => startBuying()} className="hisopados-button">
                <p className="button-text"><FaCartPlus className="icon"/>Comprar hisopado</p>
			</div>
        </div>)
        }
    }
    
    return renderContent()
}
