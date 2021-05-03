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
    const [status, setStatus] = useState(false);
    const { currentServices } = useSelector(state => state.services)

    useEffect(() => {
        const status = currentServices.find(el => el.status === 'DONE:RESULT')

        if(status) {
            setStatus(true)
        } else {
            setStatus(false)
        }
    }, [currentServices])

    return (
        <section className="homeSlider">
            {
                status && <CurrentServicesHome />
            }
            <Slider slides={slides} />
        </section>
    )
}

export default HomeSlider