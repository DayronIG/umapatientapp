import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { useHistory } from "react-router-dom"
import { FaCartPlus} from "react-icons/fa"
import Loading from '../../../GeneralComponents/Loading'
import TermsConditions from "./TermsConditions"
import FrequentQuestions from "./FrequentQuestions"
import NarrowContactInfo from "./NarrowContactInfo"
import axios from 'axios';
import {create_delivery, config} from '../../../../config/endpoints';
import db from "../../../../config/DBConnection";
import { BackButton } from '../../../GeneralComponents/Headers';
import swal from 'sweetalert';
import umaLogo from '../../../../assets/logo_original.png'

export default function AskForBuyHisopado() {
    const isLocal = window.location.origin.includes('localhost');
    const [termsConditions, setTermsConditions] = useState(false)
    const [frequentQuestions, setFrequentQuestions] = useState(false)
    const [narrowContactInfo, setNarrowContactInfo] = useState(false)
    const {params, current} = useSelector(state => state.deliveryService)
    const patient = useSelector(state => state.user)
    const userActive = useSelector(state => state.userActive)
    const [loading, setLoading] = useState(false)
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
        .where('status', 'in', ['FREE', 'FREE:IN_RANGE'])
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
        if(!isLocal){
        window.gtag('event', 'select_item', {
            'item_list_name': 'Hisopado Antígeno'
          });
        }
        let data = {
            dni: patient.dni,
            uid: userActive.currentUser.uid,
            dependant: false,
            service: 'HISOPADO'
        }
        setLoading(true)
        await axios.post(create_delivery, data, config)
            .then(async res => {
                db.firestore().doc(`/events/requests/delivery/${res.data.id}`)
                .get()
                .then(async query => {
                    // console.log(query, query.data())
                    let data = {
                        ...query.data(),
                        id: res.data.id
                    }
                    localStorage.setItem("multiple_clients", JSON.stringify([data]))
                    dispatch({type: 'SET_DELIVERY_ALL', payload: [data]})
                    dispatch({type: 'SET_DELIVERY_STEP', payload: "ADDRESS_PICKER"})
                    setLoading(false)
                })
            })
            .catch(err =>{ 
                swal("Algo salió mal", `No pudimos acceder al servicio en este momento. Intenta más tarde.`, "error")
                setLoading(false)
                console.log(err)
            })
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
                            Los hisopados se realizan en días hábiles de lunes a viernes de 8hs a 18hs.
                        </article>
                    }
                    <div className="price-center-aligner">
                        <img src={umaLogo} alt='uma_logo' className='uma_logo_hisopados'/>
                        <h2 className="price-title">Test rápido de antígenos</h2>
                        <div className="price-container">
                            <div className="discount-container">
                                <p className="hisopados-previous-price">${params?.fake_price}</p>
                                <p className="hisopados-discount">{params?.fake_discount}% OFF</p>
                            </div>
                            <p className="hisopados-price">${params?.price}</p>
                        </div>
                        <p className="disclaimer-result">Indica la presencia del virus</p>
                    </div>
                    
                    <div className="coverage">
                        <button 
                            className="coverage-btn" 
                            onClick={() => history.push(`/hisopado/cobertura/${patient.ws}`)}
                        >
                            Conocé nuestra zona de cobertura
                        </button>
                    </div>

                    <div className='read-with-attention'>
                        <div className='read-with-attention-title'>
                            Leer con atención
                        </div>
                        <div className='read-with-attention-content'>
                            <ul>
                                <li>
                                Los hisopados se realizan de <b>lunes a viernes de 8hs a 18hs</b>, para todas las compras realizadas antes de las 18hs durante los <b>días hábiles</b>. 
                                <br/>
                                Si compras fuera de ese rango, te lo realizaremos al siguiente día hábil.
                                <br/>
                                <b><u>No se realizan hisopados los días sábados, domingos ni feriados.</u></b>
                                </li>
                                <li>
                                No lo cubren las obras sociales
                                </li>
                                <li>
                                Consulte con su destino la validez del test rápido para viajar
                                </li>
                                <li>
                                <p className='blue-text'>El pago no admite cancelaciones ni devoluciones</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="hisopados-flux-container">                        
                        <p className="info-title-big">Medios de pago</p>
                        <p>Puedes pagarlo con tarjeta de crédito a través de MercadoPago.</p>
                        <p className="info-important">Importante</p>
                        <hr className="info-important-line"/>
                        <p>Sólo aceptamos pagos por la <b><u>app </u></b> de ÜMA o a través de un <b><u>link </u></b> de pago enviado via mail por nuestro personal de ÜMA.</p> 
                        <p>Si te ofrecen abonar por otro medio, NO ACEPTES, y contactanos inmediatamente.</p>
                    
                    </div>
                    <div className="hisopados-flux-container">                        
                        <p className="info-title">Contacto estrecho</p>
                        <p>Si eres contacto estrecho y <u><b>no</b></u> presentas síntomas, es importante que te hagas el test a los <b>5 días</b> del contacto para asegurar la efectividad del resultado.</p>
                        <p>¿Cómo saber si soy contacto estrecho? <br/> ¡Averígualo <a className="link__to__narrow__contact" onClick={()=>setNarrowContactInfo(true)}>aquí</a>!</p>
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
            {loading ? 
            <Loading /> : 
            renderContent()}
           </>
}
