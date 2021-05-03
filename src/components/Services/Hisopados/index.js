import React, { useState, useEffect } from 'react'  
import '../../../styles/hisopado/landingTypes.scss'
import { BackButton } from '../../GeneralComponents/Headers'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { BsChevronDoubleDown } from 'react-icons/bs'
import CardButton from '../../DeliveryService/BuyButton/CardButton'
import imgAntigenos from '../../../assets/cardAntigenos.png'
import imgExpress from '../../../assets/cardExpress.png'
import MktTextBlock from '../../Mkt/MktTextBlock'

const HisopadoType = () => {
    const history = useHistory()
    const patient = useSelector(state => state.user)
    const inPersonServiceParams = useSelector(state => state.inPersonService.params)
    const deliveryServiceParams = useSelector(state => state.deliveryService.params)
    const { params } = useSelector((state) => state.inPersonService)
    const [rooms, setRooms] = useState([])
    const [pcrPrice, setPcrPrice] = useState(null)
    const [antigenosPrice, setAntigenosPrice] = useState(null)

    useEffect(() => {
        if (params) {
            setRooms(params.consulting_rooms)
        }
    }, [params])

    useEffect(() => {
        if (inPersonServiceParams.length) {
            inPersonServiceParams.map(service => {
                if(service.test === 'abbott') {
                    setPcrPrice(service.price)
                } else if (service.test === 'antígenos') {
                    setAntigenosPrice(service.price)
                }
            })
        }
    }, [inPersonServiceParams])

    const buyHisopado = () => {
        window.gtag('event', 'view_promotion', {
            'items': 'Hisopado Antígeno',
            'promotion_id': '1',
            'promotion_name': 'Hisopado',
            'location_id': 'home'
        });
        history.push(`/hisopado/${patient.ws}`)
    }

    const confirmHisopado = () => {
        history.push(`/hisopado/antigenos`)
    }

    const handleWantHisopado = () => {
        if (patient.corporate_norm !== 'IOMA') {
            buyHisopado()
        } else {
            confirmHisopado()
        }
    }

    return (
        <>
            <BackButton />

            <section className="hisopados__type">
                <div className="hisopados__typeHeader">
                    <h1>Testeos de COVID-19</h1>
                    {/* <p>Desde UMA queremos cuidarte, ¡y por eso tenemos diversas opciones para que te testees y estés tranquilo!</p> */}
                </div>
                <div className="hisopados__typeContent">
                    <h2>En puntos de testeo</h2>
                    <CardButton
                        img={imgExpress}
                        destinies={['En sede']}
                        title="PCR Express"
                        text="Indica la presencia de virus mediante un hisopado nasofaríngeo."
                        result="Resultado en 15 minutos."
                        price={pcrPrice}
                        action={() => history.push('/hisopado/express')}
                    />

                    <CardButton 
                        img={imgAntigenos} 
                        title="Test de antígenos"
                        text="Indica la presencia de virus mediante un hisopado nasofaríngeo."
                        result="Resultado en 15 minutos."
                        price={antigenosPrice}
                        action={() => history.push('/hisopado/antigenos')}
                    />

                    <h2>A domicilio</h2>
                    <CardButton
                        img={imgAntigenos}
                        title="Test de antígenos"
                        text={`¡Pídelo ahora y tienes tu resultado ${deliveryServiceParams.delay}!`}
                        result="Resultado en 15 minutos."
                        price={deliveryServiceParams.price}
                        action={handleWantHisopado}
                    />
                </div>
                <div className="hisopados__typeFooter">
                    <article>
                        <h2>Medios de pago</h2>
                        <p>Puedes pagarlo con tarjeta de crédito a través de MercadoPago.</p>
                    </article>
                    <article>
                        <h2>Contacto cercano</h2>
                        <p>Si eres contacto estrecho y no presentas síntomas, es importante que te hagas el test a los 5 días del contacto para asegurar la efectividad del resultado.</p>
                    </article>
                </div>
            </section>
        </>
    )
}

export default HisopadoType