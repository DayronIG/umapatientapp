import React, { useState, useEffect } from 'react'
import '../../styles/hisopado/hisopadosFlux.scss'
import './GeneralLandingsStyles.scss'
import "../../styles/hisopado/frequentQuestions.scss";
import "../../styles/hisopado/hisopadosFlux.scss";
import { analysis } from '../../config/endpoints'
import { BackButton } from '../GeneralComponents/Headers'
import { useHistory} from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import CustomUmaLoader from '../GeneralComponents/Loading'
import FrequentQuestionsPCR from "../DeliveryService/DeliveryPurchase/Components/FrequentQuestionsPCR"
import MktBuyButton from '../Mkt/MktBuyButton'
import MktHeader from '../Mkt/MktHeader'
import MktTextBlock from '../Mkt/MktTextBlock'
import NarrowContactInfo from '../DeliveryService/DeliveryPurchase/Components/NarrowContactInfo'
import TermsConditions from "../DeliveryService/DeliveryPurchase/Components/TermsConditions"


const Abbott = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const { currentUser } = useSelector((state) => state.userActive)
    const inPersonServiceParams = useSelector(state => state.inPersonService.params)
    const [pcrPrice, setPcrPrice] = useState(null)
    const [rooms, setRooms] = useState([])
    const [loader, setLoader] = useState(false)
    const [termsConditions, setTermsConditions] = useState(false)
    const [frequentQuestions, setFrequentQuestions] = useState(false)
    const [narrowContactInfo, setNarrowContactInfo] = useState(false)

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        if (inPersonServiceParams.length) {
            inPersonServiceParams.map(service => {
                if (service.test === 'abbott') {
                    setPcrPrice(service.price)
                    setRooms(service.consulting_rooms)
                }
            })
        }
    }, [inPersonServiceParams])

    const payHisopado = () => {
        if(!currentUser) {
            history.push('/')
        }
        setLoader(true)
        dispatch({ type: 'SET_IN_PERSON_SERVICE', payload: 'PCR Express'})
        dispatch({ type: 'SET_CURRENT_IN_PERSON_SERVICE_USER', payload: currentUser })

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
                    dispatch({
                        type: 'SET_PAYMENT',
                        payload: {
                            product: 'pcr_express',
                            quantity: 1,
                            title: 'PCR Express',
                            uid: currentUser.uid,
                            service: 'PCR Express',
                            price: pcrPrice,
                            mercadoPago: true,
                            abbottId: res.data.id || res.data.doc_id
                        }
                    })
                    localStorage.setItem('paymentData', JSON.stringify({
                        product: 'pcr_express',
                        quantity: 1,
                        title: 'PCR Express',
                        uid: currentUser.uid,
                        service: 'PCR Express',
                        price: pcrPrice,
                        mercadoPago: true,
                        abbottId: res.data.id || res.data.doc_id
                    }));
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

    if(loader) {
        return <CustomUmaLoader />
    }
    

    const renderContent = () => {
        if (termsConditions) {
            return <TermsConditions goBack={() => setTermsConditions(false)} />
        } else if (frequentQuestions) {
            return <FrequentQuestionsPCR goBack={() => setFrequentQuestions(false)} />
        } else if (narrowContactInfo) {
            return <NarrowContactInfo goBack={() => setNarrowContactInfo(false)} />
        } else {
            return (
                <>
                    <BackButton customTarget="/hisopado/type" />
                    <div className="generalLanding">
                        <MktHeader title="PCR Express" price={pcrPrice || '7500'} text="Resultado en 15 minutos" />

                        <MktTextBlock title="Puntos de testeo">
                            <p className="outstanding center">De lunes a viernes de 8hs a 20hs</p>
                            {
                                rooms.length ?
                                rooms.map((room, index) => (
                                    <div className="group" key={index}>
                                        <h3 className="bold underline">{room.name}:</h3>
                                        <p className="no_margin">{room.address}</p>
                                    </div>
                                )) :
                                <>
                                    <div className="group">
                                        <h3 className="bold underline">CABA:</h3>
                                        <p className="no_margin">Av. General Las Heras 3029</p>
                                    </div>
                                    <div className="group">
                                        <h3 className="bold underline">Olivos:</h3>
                                        <p className="no_margin">Av. Maipu 3625</p>
                                    </div>
                                    <div className="group">
                                        <h3 className="bold underline">Lomas de Zamora:</h3>
                                        <p className="no_margin">Rivera 382</p>
                                    </div>
                                </>
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
                            <p>Si eres contacto estrecho y <span className="bold underline">no</span> presentas síntomas, es importante que te hagas el test a partir de los <span className="bold">5 días</span> del contacto para asegurar la efectividad del resultado.</p>
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

    
    return( <>
        {renderContent()}
    </>)
}

export default Abbott