import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { useHistory } from "react-router-dom"
import { FaCartPlus} from "react-icons/fa"
import TermsConditions from "./TermsConditions"
import FrequentQuestions from "./FrequentQuestions"
import NarrowContactInfo from "./NarrowContactInfo"
import axios from 'axios';
import {create_delivery, config} from '../../../../config/endpoints';
import db from "../../../../config/DBConnection";
import { BackButton } from '../../../GeneralComponents/Headers';
import swal from 'sweetalert';

export default function AskForBuyHisopado() {
    const [termsConditions, setTermsConditions] = useState(false)
    const [frequentQuestions, setFrequentQuestions] = useState(false)
    const [narrowContactInfo, setNarrowContactInfo] = useState(false)
    const {params, current} = useSelector(state => state.deliveryService)
    const patient = useSelector(state => state.user)
    const dispatch = useDispatch()
    const history = useHistory()

    useEffect(() => {
        if(patient.dni) {
            getCurrentService()
        }
    }, [patient])

    const getCurrentService = async () => {
        let deliveryInfo = []
        await db.firestore().collection('events/requests/delivery')
        .where('patient.uid', '==', patient.core_id)
        .where('status', 'in', ['FREE', 'FREE:IN_RANGE', 'FREE:FOR_OTHER',  'PREASSIGN', 'ASSIGN:DELIVERY', 'ASSIGN:ARRIVED', 'DONE:RESULT', 'FREE:DEPENDANT', "DEPENDANT"])
        .get()
        .then(async res => {
            res.forEach(services => {
                let document = {...services.data(), id: services.id}
                deliveryInfo.push(document)
                dispatch({type: 'SET_DELIVERY_CURRENT', payload: document})
            })
        })
        dispatch({type: 'SET_DELIVERY_ALL', payload: deliveryInfo})
    }

    const startBuying = async () => {
        window.gtag('event', 'select_item', {
            'item_list_name': 'Hisopado Antígeno'
          });
        if(!current?.status) {
            let data = {
                dni: patient.dni,
                dependant: false,
                service: 'HISOPADO'
            }
            await axios.post(create_delivery, data, config)
                .then(async res => {
                    setTimeout(() => {
                        db.firestore().doc(`/events/requests/delivery/${res.data.id}`)
                        .get()
                        .then(async query => {
                            console.log(query, query.data())
                            let data = {
                                ...query.data(),
                                id: res.data.id
                            }
                            localStorage.setItem("multiple_clients", JSON.stringify([data]))
                            dispatch({type: 'SET_DELIVERY_ALL', payload: [data]})
                            dispatch({type: 'SET_DELIVERY_STEP', payload: "ADDRESS_PICKER"})
    
                        })
                    }, 1500)
                })
                .catch(err =>{ 
                    swal("Algo salió mal", `No pudimos acceder al servicio en este momento. Intenta más tarde.`, "error")
                    console.log(err)
                })
        } else {
            dispatch({type: 'SET_DELIVERY_STEP', payload: "ADDRESS_PICKER"})
        }
    }

    const renderContent = () => {
        if(termsConditions){
            return <TermsConditions goBack={() => setTermsConditions(false)} />
        } else if (frequentQuestions) {
            return <FrequentQuestions goBack={() => setFrequentQuestions(false)}/>
        } else if (narrowContactInfo) {
            return <NarrowContactInfo goBack={() => setNarrowContactInfo(false)}/>
        } else {
            return (
                <div>
                    {
                        !params.active &&
                        <article className="hisopados-alert">
                            Los hisopados se realizan de lunes a viernes de 8hs a 18hs.
                        </article>
                    }
                    <p className="hisopados-title">¡Conocé nuestro <br/> test rápido!</p>
                    <p className="hisopados-subtitle">Te hacemos tu hisopado a domicilio. Ahora podés pedirlo durante todo el día, desde la comodidad de tu hogar.</p>
                    <div className="price-center-aligner">
                        <h2 className="price-title">Test rápido de antígenos</h2>
                        <div className="price-container">
                            <div className="discount-container">
                                <p className="hisopados-previous-price">${params?.fake_price}</p>
                                <p className="hisopados-discount">{params?.fake_discount}% OFF</p>
                            </div>
                            <p className="hisopados-price">${params?.price}</p>
                        </div>
                        <p className="disclaimer-result">Indica la presencia del virus</p>
                        <p className="disclaimer-time">Entrega de resultado en 15 minutos en tu domicilio</p>
                    </div>
                    
                    <div className="coverage">
                        <button 
                            className="coverage-btn" 
                            onClick={() => history.push(`/hisopado/cobertura/${patient.ws}`)}
                        >
                            Conocé nuestra zona de cobertura
                        </button>
                    </div>

                    <div className="hisopados-flux-container">                        
                        <p className="info-title">¿En qué consiste?</p>
                        <p>Es un test rápido de detección del Covid-19 avalado por la OMS, realizado por nuestro personal de salud en tu domicilio.<br />
                        Es una excelente alternativa al hisopado tradicional, económica y veloz, ¡en sólo 15 minutos tienes el resultado!</p>

                        <p>Además te brindamos <span className="info-destacado">atención médica</span> una vez realizado el hisopado a través de nuestra plataforma.</p>
                        
                        <p className="info-title">Medios de pago</p>
                        <p>Puedes pagarlo con tarjeta de crédito y débito a través de MercadoPago.</p>

                        <br />
                        <br />

                        <p className="info-title">Contacto estrecho</p>
                        <p>Si eres contacto estrecho y <u><b>no</b></u> presentas síntomas, es importante que te hagas el test a los <b>5 días</b> del contacto para asegurar la efectividad del resultado.</p>
                        <p>¿Cómo saber si soy contacto estrecho? <br/> ¡Averígualo <a className="link__to__narrow__contact" onClick={()=>setNarrowContactInfo(true)}>aquí</a>!</p>
                    </div>

                    <div className="hisopados-atentionContainer">
                        <h2>A tener en cuenta</h2>
                        <ul>
                            <li>• Los hisopados se realizan de lunes a viernes de 8hs a 18hs para todas las compras realizadas antes de las 18hs durante los días hábiles. Si compras fuera de ese rango, te lo realizaremos al siguiente día hábil. El tiempo de envío es de un máximo de 3 horas desde la recepción del pago. No se realizan hisopados los días domingos ni feriados.</li>
                            <li>• No lo cubren las obras sociales</li>
                            <li>• No emite certificado oficial</li>
                            <li>• Consulte con su destino la validez del test rápido para viajar</li>
                            <li>• El pago no admite cancelaciones ni devoluciones.</li>
                        </ul>
                    </div>

                    <p className="terms-questions">
                        <span onClick={()=>setTermsConditions(true)}>Términos y condiciones</span>
                        <br/>
                        <br/>
                        <span onClick={()=>setFrequentQuestions(true)}>Preguntas frecuentes</span>
                    </p>
                    <div onClick={() => params?.price ? startBuying(): ""} className="hisopados-button">
                        <p className="button-text"><FaCartPlus className="icon"/>Comprar mi hisopado</p>
                    </div>
                </div>
            )
        }
    }

    const goBackButton = () => {
        if (narrowContactInfo){return setNarrowContactInfo(false)}
        else {return history.push("/")}
    }
    
    return <>
            {!termsConditions && !frequentQuestions && <BackButton inlineButton={true} customTarget={patient.ws} action={()=>goBackButton()} />}
            {renderContent()}
           </>
}
