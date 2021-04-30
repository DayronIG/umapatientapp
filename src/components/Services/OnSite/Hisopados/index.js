import React, { useState, useEffect } from 'react'  
import '../../../../styles/hisopado/landingTypes.scss'
import { BackButton } from '../../../GeneralComponents/Headers'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { BsChevronDoubleDown } from 'react-icons/bs'
import CardButton from '../../../DeliveryService/BuyButton/CardButton'
import imgAntigenos from '../../../../assets/cardAntigenos.png'
import imgExpress from '../../../../assets/cardExpress.png'

const HisopadoType = () => {
    const history = useHistory()
    const patient = useSelector(state => state.user)
    const inPersonServiceParams = useSelector(state => state.inPersonService.params)
    const deliveryServiceParams = useSelector(state => state.deliveryService.params)
    const { params } = useSelector((state) => state.inPersonService)
    const [rooms, setRooms] = useState([])


    useEffect(() => {
        if (params) {
            setRooms(params.consulting_rooms)
        }
    }, [params])

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
        history.push(`/hisopado/corporate/${patient.ws}`)
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
                    <p>Desde UMA queremos cuidarte, ¡y por eso tenemos diversas opciones para que te testees y estés tranquilo!</p>
                    {/* <p>Indica la presencia de virus  <span>en 15 minutos</span> mediante un hisopado nasofaríngeo.</p> */}
                    {/* <span className="hisopados__typeChevron">
                        <BsChevronDoubleDown />
                    </span> */}
                </div>
                <div className="twocolumns__title">
                    <div className="badge__enSede">
                        <h2>En Puntos De Testeo</h2>
                        <div className='badge__testSpots'>
                            {
                                !!rooms &&
                                rooms.map((room, index) => (
                                    <div className="group" key={index}>
                                        <h3 className="bold underline">{room.name}</h3>
                                        <p className="no_margin">{room.address}</p>
                                    </div>
                                ))
                            }
                        </div>

                    </div>
                </div>

                <div className='twocolumns'>
                        <CardButton
                            img={imgExpress}
                            destinies={['En sede']}
                            title="PCR Express"
                            text="Indica la presencia de virus mediante un hisopado nasofaríngeo."
                            result="Resultado en 15 minutos."
                            price={inPersonServiceParams.price}
                            action={() => history.push('/hisopado/express')}
                        />


                        <CardButton
                            img={imgAntigenos}
                            destinies={['En sede']}
                            title="Antígenos Express"
                            text="Indica la presencia de virus mediante un hisopado nasofaríngeo."
                            result="Resultado en 15 minutos."
                            price={inPersonServiceParams.price}
                            action={() => history.push('/hisopado/antigenos_sede')}
                        />
                    </div>

                <div className="onecolumn__title">
                    <div className="badge__enSede2">
                        <h2>A Domicilio</h2>
                    </div>
                </div>
                <div className="onecolumn">
                    <CardButton
                        img={imgAntigenos}
                        destinies={['A domicilio']}
                        title="Antígenos Domicilio"
                        text="Indica la presencia de virus mediante un hisopado nasofaríngeo."
                        result="Resultado en 15 minutos."
                        price={deliveryServiceParams.price}
                        action={handleWantHisopado}
                    />
                </div>
                            {/* <CardButton 
                                img={imgAntigenos} 
                                destinies={['En sede']} 
                                title="Test de antígenos en sede" 
                                text="Indica la presencia de virus mediante un hisopado nasofaríngeo." 
                                result="Resultado en 15 minutos." 
                                price={deliveryServiceParams.price}
                                action={handleWantHisopado}
                            /> */}


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