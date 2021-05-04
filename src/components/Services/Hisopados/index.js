import React, { useState, useEffect } from 'react'  
import '../../../styles/hisopado/landingTypes.scss'
import { BackButton } from '../../GeneralComponents/Headers'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import CardButton from '../../DeliveryService/BuyButton/CardButton'
import imgAntigenos from '../../../assets/cardAntigenos.png'
import imgExpress from '../../../assets/cardExpress.png'
import MobileModal from '../../GeneralComponents/Modal/MobileModal'

const HisopadoType = () => {
    const history = useHistory()
    const patient = useSelector(state => state.user)
    const inPersonServiceParams = useSelector(state => state.inPersonService.params)
    const deliveryServiceParams = useSelector(state => state.deliveryService.params)
    const [rooms, setRooms] = useState([])
    const [pcrPrice, setPcrPrice] = useState(null)
    const [antigenosPrice, setAntigenosPrice] = useState(null)
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        if (inPersonServiceParams.length) {
            inPersonServiceParams.map(service => {
                if(service.test === 'abbott') {
                    setPcrPrice(service.price)
                    setRooms(service.consulting_rooms)
                } else if (service.test === 'antígenos') {
                    setAntigenosPrice(service.price)
                    setRooms(service.consulting_rooms)
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
                    <div className="rooms">
                        {
                            rooms.map(room => (
                                <p key={room.address}>{room.name}</p>
                            ))
                        }
                    </div>
                    <div className="disclaimer" onClick={() => setShowModal(true)}>
                        <p>¿Cuál es la diferencia entre un test de antígenos y un PCR Express?</p>
                    </div>
                    {
                        showModal &&
                        <MobileModal hideTitle callback={() => setShowModal(false)}>
                            <p>Principalmente el test de antígenos sirve para detectar si estás cursando la enfermedad y demuestra mayor efectividad si se realiza en el momento de mayor carga viral que es cuando tenés síntomas (fiebre, tos seca, cansancio, dolor de cabeza, molestias en el cuerpo, pérdida del sentido del gusto o del olfato). Otorga resultados dentro de los 15 minutos de haberse realizado el test. Puede realizarse tanto en domicilio como en los puntos de testeo.</p>

                            <p>Por otro lado el test PCR Express te lo podés realizar con o sin tener síntomas ya que este tipo de test detecta el ADN del virus desde sus fases iniciales y tiene una eficiencia cercana al 100%. También es ideal para cuando tuviste un contacto estrecho o tenes que viajar. Con resultados en 15 minutos de haberse realizado el test. Podés realizarlo en cualquiera de nuestros puntos de testeo:</p>

                            <ul>
                                <li>Av. Las Heras 3029 – CABA</li>
                                <li>Av. Maipú 3625 – Olivos</li>
                                <li>Rivera 382 – Lomas de Zamora</li>
                            </ul>
                        </MobileModal>
                    }
                    <CardButton
                        img={imgExpress}
                        destinies={['En sede']}
                        title="PCR Express"
                        text="Te lo podés realizar con o sin síntomas. Apto para viajar. Válido para prequirúrgico."
                        result="Resultado en 15 minutos."
                        price={pcrPrice}
                        action={() => history.push('/hisopado/express')}
                    />

                    <CardButton 
                        img={imgAntigenos} 
                        title="Test de antígenos"
                        text="Demuestra mayor efectividad si se realiza con síntomas o posterior al 5to día de contacto estrecho. No apto para viajar."
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
                        <p>Si eres contacto estrecho y no presentas síntomas, es importante que te hagas el test a partir de los 5 días del contacto para asegurar la efectividad del resultado.</p>
                    </article>
                </div>
            </section>
        </>
    )
}

export default HisopadoType