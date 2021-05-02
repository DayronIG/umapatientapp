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
import FrequentQuestionsSede from "../DeliveryService/DeliveryPurchase/Components/FrequentQuestionsSede"
import TermsConditions from "../DeliveryService/DeliveryPurchase/Components/TermsConditions"
import NarrowContactInfo from '../DeliveryService/DeliveryPurchase/Components/NarrowContactInfo'
import "../../styles/hisopado/hisopadosFlux.scss";
import "../../styles/hisopado/frequentQuestions.scss";


const Antigenos = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const { currentUser } = useSelector((state) => state.userActive)
    const { params } = useSelector((state) => state.inPersonService)
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

    const payHisopado = () => {
        setLoader(true)
        dispatch({ type: 'SET_IN_PERSON_SERVICE', payload: 'PCR Express' })
        dispatch({ type: 'SET_CURRENT_IN_PERSON_SERVICE_USER', payload: currentUser })

        dispatch({
            type: 'SET_PAYMENT',
            payload: {
                product: 'pcr_express',
                quantity: 1,
                title: 'PCR Express',
                uid: currentUser.uid,
                service: 'PCR Express',
                price: params.price,
                mercadoPago: true,
            }
        })
        localStorage.setItem('paymentData', JSON.stringify({
            product: 'pcr_express',
            quantity: 1,
            title: 'PCR Express',
            uid: currentUser.uid,
            service: 'PCR Express',
            price: params.price,
            mercadoPago: true
        }));

        try {
            const data = {
                uid: currentUser.uid,
                service: 'PCR Express',
                destination: {
                    address: '',
                    floor: '',
                    lat: '',
                    lon: '',
                    number: ''
                },
            }
            axios.post(`${analysis}/`, data)
                .then(res => {
                    setLoader(false)
                    dispatch({ type: 'SET_DOC_ID', payload: res.data.id })
                    localStorage.setItem('pcr_express_doc_id', res.data.id)
                    history.push(`/payments/checkout/${currentUser.uid}`)
                })
                .catch(e => {
                    console.error(e)
                    setLoader(false)
                })
        } catch (e) {
            console.error(e)
            setLoader(false)
        }
    }

    if (loader) {
        return <CustomUmaLoader />
    }


    const renderContent = () => {
        if (termsConditions) {
            return <TermsConditions goBack={() => setTermsConditions(false)} />
        } else if (frequentQuestions) {
            return <FrequentQuestionsSede goBack={() => setFrequentQuestions(false)} />
        } else if (narrowContactInfo) {
            return <NarrowContactInfo goBack={() => setNarrowContactInfo(false)} />
        } else {
            return (
                <>
                    <BackButton customTarget="/hisopado/type" />
                    <div className="generalLanding">
                        <MktHeader title="Test Antígenos" price={params.price} text="Resultado en 15 minutos" />

                        <MktTextBlock title="Puntos de testeo">
                            <p className="outstanding center">De lunes a viernes de 8hs a 20hs</p>
                            {
                                !!rooms &&
                                rooms.map((room, index) => (
                                    <div className="group" key={index}>
                                        <h3 className="bold underline">{room.name}</h3>
                                        <p className="no_margin">{room.address}</p>
                                    </div>
                                ))
                            }
                        </MktTextBlock>

                        <MktTextBlock title="Horarios">
                            <p className="outstanding center">De lunes a viernes de 8hs a 20hs</p>
                            <p>Reserva tu hisopado cuando desees a través de la app y dirigite a cualquiera de nuestros centros de testeo para realizarlo.</p>
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

                    <MktBuyButton action={payHisopado}>Comprar</MktBuyButton>
                </>
            )
        }
    }

    return (<>
        {renderContent()}
    </>)
}

export default Antigenos