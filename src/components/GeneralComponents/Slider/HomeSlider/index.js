import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Slider from '../'
import PcrExpress from '../Slides/PcrExpress'
import AntigenoDelivery from '../Slides/AntigenoDelivery'
import CurrentServicesHome from '../../CurrentServicesHome/'
import './HomeSlider.scss'

const HomeSlider = () => {
    const slides = [
        <PcrExpress />,
        <AntigenoDelivery />
    ]
    const [activeServices, setActiveServices] = useState(0);
    const { currentServices } = useSelector(state => state.services)

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
            <Slider slides={slides} />
        </section>
    )
}

export default HomeSlider