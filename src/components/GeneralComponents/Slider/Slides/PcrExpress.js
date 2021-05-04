import React, { useState, useEffect } from 'react'
import { FaChevronRight } from 'react-icons/fa'
import { useHistory } from 'react-router-dom'
import { useSelector } from "react-redux";
import imgExpress from '../../../../assets/cardExpress.png'

const PcrExpress = () => {
    const history = useHistory()
    const inPersonServiceParams = useSelector(state => state.inPersonService.params)
    const [pcrPrice, setPcrPrice] = useState(null)

    useEffect(() => {
        if (inPersonServiceParams.length) {
            inPersonServiceParams.map(service => {
                if (service.test === 'abbott') {
                    setPcrPrice(service.price)
                }
            })
        }
    }, [inPersonServiceParams])

    return (
        <div className="slide" onClick={() => history.push('/hisopado/type')}>
            <div className='twocolumns'>
                <div className="text">
                    <h2>Nuevo</h2>
                    <h1>PCR Express</h1>
                    <p>Disponible en puntos de testeo (CABA, Olivos y Lomas de Zamora)</p>
                </div>
                <div className='price'>
                    <p>A sólo</p>
                    <h1>${pcrPrice}</h1>
                </div>
            </div>
            <div className="img">
                <img src={imgExpress} alt="PCR Express"/>
            </div>
            <div className="button">
                <button className="slide__btn">Comprá tu hisopado <FaChevronRight /></button>
            </div>
        </div>
    )
}

export default PcrExpress

