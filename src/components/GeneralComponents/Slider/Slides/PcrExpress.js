import React, { useState, useEffect } from 'react'
import { useSelector } from "react-redux";
import { FaChevronRight } from 'react-icons/fa'
import { useHistory } from 'react-router-dom'

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
                    <h2>NUEVO</h2>
                    <h1>PCR EXPRESS</h1>
                </div>
                <div className='price'>
                    <p>A sólo</p>
                    <h1>${pcrPrice}</h1>
                </div>
            </div>
            <div className="button">
                <button className="slide__btn">Quiero mi hisopado <FaChevronRight /></button>
            </div>
        </div>
    )
}

export default PcrExpress

