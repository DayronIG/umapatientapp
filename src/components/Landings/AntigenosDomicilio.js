import React, { useState, useEffect } from 'react'
import { BackButton } from '../GeneralComponents/Headers'
import './GeneralLandingsStyles.scss'
import '../../styles/hisopado/hisopadosFlux.scss'
import MktHeader from '../Mkt/MktHeader'
import MktTextBlock from '../Mkt/MktTextBlock'
import MktBuyButton from '../Mkt/MktBuyButton'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import { analysis } from '../../config/endpoints'
import CustomUmaLoader from '../GeneralComponents/Loading'
import FrequentQuestions from "../DeliveryService/DeliveryPurchase/Components/FrequentQuestions"
import TermsConditions from "../DeliveryService/DeliveryPurchase/Components/TermsConditions"
import NarrowContactInfo from '../DeliveryService/DeliveryPurchase/Components/NarrowContactInfo'
import "../../styles/hisopado/hisopadosFlux.scss";
import "../../styles/hisopado/frequentQuestions.scss";
import db, { firebaseInitializeApp } from "../../config/DBConnection";
import { create_delivery, config } from '../../config/endpoints';
import swal from 'sweetalert';




const AntigenosDomicilio = () => {
    const isLocal = window.location.origin.includes('localhost');
    const userActive = useSelector(state => state.userActive)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const history = useHistory()
    const { currentUser } = useSelector((state) => state.userActive)
    const { params } = useSelector((state) => state.deliveryService)
    const patient = useSelector(state => state.user)
    const [rooms, setRooms] = useState([])
    const [loader, setLoader] = useState(false)
    const [termsConditions, setTermsConditions] = useState(false)
    const [frequentQuestions, setFrequentQuestions] = useState(false)
    const [narrowContactInfo, setNarrowContactInfo] = useState(false)


    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        if (params) {
            setRooms(params.consulting_rooms)
        }
    }, [params])

    const startBuying = async () => {
        if (!isLocal) {
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
                db.firestore(firebaseInitializeApp).doc(`/events/requests/delivery/${res.data.id}`)
                    .get()
                    .then(async query => {
                        // console.log(query, query.data())
                        let data = {
                            ...query.data(),
                            id: res.data.id
                        }
                        localStorage.setItem("multiple_clients", JSON.stringify([data]))
                        dispatch({ type: 'SET_DELIVERY_ALL', payload: [data] })
                        dispatch({ type: 'SET_DELIVERY_STEP', payload: "ADDRESS_PICKER" })
                        setLoading(false)
                    })
            })
            .catch(err => {
                swal("Algo salió mal", `No pudimos acceder al servicio en este momento. Intenta más tarde.`, "error")
                setLoading(false)
                console.log(err)
            })
    }

    if (loader) {
        return <CustomUmaLoader />
    }

    const renderContent = () => {
        if (termsConditions) {
            return <TermsConditions goBack={() => setTermsConditions(false)} />
        } else if (frequentQuestions) {
            return <FrequentQuestions goBack={() => setFrequentQuestions(false)} />
        } else if (narrowContactInfo) {
            return <NarrowContactInfo goBack={() => setNarrowContactInfo(false)} />
        } else {
            return (
            <>
                <BackButton />
                <div className="generalLanding">
                    <MktHeader title="Test Antígenos A Domicilio" price={params.price} text="Resultado en 15 minutos" />



                        <MktTextBlock title="Conocé Nuestra Zona De Cobertura">
                            <div className="hisopados-flux">
                                <div className="coverage">
                                    <button
                                        className="coverage-btn"
                                        onClick={() => history.push(`/hisopado/cobertura/${patient.ws}`)}
                                        >Zona de cobertura</button>
                                    <br />
                                    <span className="coverage-btn" onClick={() => setFrequentQuestions(true)}>Preguntas frecuentes</span>
                                </div>
                        </div>
                        {/* {
                            !!rooms &&
                            rooms.map((room, index) => (
                                <div className="group" key={index}>
                                    <h3 className="bold underline">{room.name}</h3>
                                    <p className="no_margin">{room.address}</p>
                                </div>
                            ))
                        } */}
                        {/* <p style={{fontWeight:'bold', textAlign:'center'}}>Horarios</p> */}

                    </MktTextBlock>


                    <MktTextBlock title="Horarios">
                        <p className="outstanding center">De lunes a viernes de 8hs a 20hs para todas las compras realizadas antes de las 18hs. </p>
                        <p>No se realizan hisopados los días domingos ni feriados.</p>
                        <p>Si compras fuera del rango de atención, te lo realizaremos al siguiente día hábil.</p>
                        <p className="bold underline">No se realizan hisopados los días sábados, domingos ni feriados.</p>
                    </MktTextBlock>

                    <MktTextBlock title="Cobertura">
                        <p>Es un hisopado particular, por ende no lo cubren las obras sociales.</p>
                        <p>Recomendamos consultar con su destino la validez del test rápido para viajar.</p>
                    </MktTextBlock>

                    <MktTextBlock title="Medios de pago">
                        <p>Puedes pagarlo con tarjeta de débito, crédito o con dinero disponible en MercadoPago.</p>
                        <p className="clarification">El pago no admite cancelaciones ni devoluciones.</p>

                        <p className="important">IMPORTANTE</p>
                        <p>Es un hisopado particular, por ende no lo cubren las obras sociales.</p>
                        <p>Sólo aceptamos pagos por la <span className="bold">APP de ÜMA</span>, si te ofrecen abonar por otro medio, NO ACEPTES y contactanos inmediatamente.</p>

                    </MktTextBlock>

                    <MktTextBlock title="Contacto estrecho">
                        <p>Si eres contacto estrecho y <span className="bold underline">no</span> presentas síntomas, es importante que te hagas el test a los <span className="bold">5 días</span> del contacto para asegurar la efectividad del resultado.</p>
                        <p>¿Cómo saber si soy contacto estrecho? <br /> ¡Averígualo <a className="link__to__narrow__contact" onClick={() => setNarrowContactInfo(true)}>aquí</a>!</p>
                    </MktTextBlock>

                    <div className='FAQTC'>
                        <span className="coverage-btn" onClick={() => setFrequentQuestions(true)}>Preguntas frecuentes</span>
                        <div className="break" style={{ flexBasis: '100%', height: '0' }}></div>
                        <span className="coverage-btn" onClick={() => setTermsConditions(true)}
                        >Términos y condiciones</span>
                    </div>
                </div>

                    <MktBuyButton action={() => params?.price ? startBuying() : ""}>Comprar</MktBuyButton>
            </>
        )
    }
    }


    return (
        <div>
            {renderContent()}
        </div>
    )
}

export default AntigenosDomicilio
