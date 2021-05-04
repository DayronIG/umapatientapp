import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Slider from '../'
import PcrExpress from '../Slides/PcrExpress'
import AntigenoDelivery from '../Slides/AntigenoDelivery'
import AntigenoOnSite from '../Slides/AntigenoOnSite'
import CurrentServicesHome from '../../CurrentServicesHome/'
import './HomeSlider.scss'
import DBConnection, { firebaseInitializeApp } from '../../../../config/DBConnection'
import Slide from '../Slides'

const HomeSlider = () => {
    const db = DBConnection.firestore(firebaseInitializeApp)
    // const slides = [
    //     <PcrExpress />,
    //     <AntigenoOnSite />,
    //     <AntigenoDelivery />
    // ]
    const [activeServices, setActiveServices] = useState(0);
    const [slides, setSlides] = useState([])
    const { currentServices } = useSelector(state => state.services)
    const deliveryServiceParams = useSelector(state => state.deliveryService?.params)

    useEffect(() => {
        try {
            db.collection('parametros').doc('userapp').collection('home_slider').orderBy('order', 'asc').get()
                .then(docs => {
                    let arr = []
                    docs.forEach(doc => {
                        if(doc.data().active) {
                            arr.push(<Slide 
                                title={doc.data().title} 
                                text={doc.id === 'antigenos_delivery' ? `¡Pídelo ahora y tienes tu resultado ${deliveryServiceParams?.delay}!` : doc.data().text} 
                                price={doc.data().price} 
                                cta={doc.data().cta} 
                                action={doc.data().action} 
                                img={doc.data().img}  
                            />)
                        }
                    })
                    setSlides(arr)
                })
                .catch(e => console.error(e))
        } catch (e) {
            console.error(e)
        }
    }, [])

    useEffect(() => {
        const allServices = [].concat(currentServices.delivery, currentServices.onSite)
        const active = allServices.filter(service => service.status !== 'FREE' && service.status !== 'FREE:IN_RANGE' && service.status !== 'FREE:OUT_OF_RANGE')

        setActiveServices(active.length)
    }, [currentServices])

    return (
        <section className="homeSlider">
            {
                !!activeServices && <CurrentServicesHome qty={activeServices} />
            }
            {
                !!slides.length &&
                <Slider slides={slides} />
            }
        </section>
    )
}

export default HomeSlider