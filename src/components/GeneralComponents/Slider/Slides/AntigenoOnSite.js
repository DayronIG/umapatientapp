import React, { useState, useEffect } from 'react'
import { FaChevronRight } from 'react-icons/fa'
import { useHistory } from 'react-router-dom'
import { useSelector } from "react-redux";
import imgAntigenos from '../../../../assets/cardAntigenos.png'

const AntigenoOnSite = () => {
    const history = useHistory()
    const inPersonServiceParams = useSelector(state => state.inPersonService.params)
    const [pcrPrice, setPcrPrice] = useState(null)

    useEffect(() => {
        if (inPersonServiceParams.length) {
            inPersonServiceParams.map(service => {
                if (service.test === 'antígenos') {
                    setPcrPrice(service.price)
                }
            })
        }
    }, [inPersonServiceParams])

    return (
        <div className="slide" onClick={() => history.push('/hisopado/type')}>
            <div className='twocolumns'>
                <div className="text">
                    <h1>Test de antígenos en puntos de testeo</h1>
                    <p>Disponible en puntos de testeo (CABA, Olivos y Lomas de Zamora)</p>
                </div>
                <div className='price'>
                    <p>A sólo</p>
                    <h1>${pcrPrice}</h1>
                </div>
            </div>
            <div className="img">
                <img src={imgAntigenos} alt="Test de antígenos" />
            </div>
            <div className="button">
                <button className="slide__btn">Comprá tu hisopado <FaChevronRight /></button>
            </div>
        </div>
    )
}

export default AntigenoOnSite

