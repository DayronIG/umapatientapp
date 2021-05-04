import React from 'react'
import { FaChevronRight } from 'react-icons/fa'
import { useHistory } from 'react-router-dom'
import { useSelector } from "react-redux";
import imgAntigeno from '../../../../assets/img/home-hisopado.png'

const AntigenoDelivery = () => {
    const history = useHistory()
    const deliveryServiceParams = useSelector(state => state.deliveryService?.params)
    const corporate = useSelector((state) => state.user?.corporate_norm);

    return (
        <div className="slide" onClick={() => history.push('/hisopado/type')}>
            <div className='twocolumns'>
                <div className="text">
                    <h1>Test de antígenos a domicilio</h1>
                    <p>{`¡Pídelo ahora y tienes tu resultado ${deliveryServiceParams?.delay}!`}</p>
                </div>
                <div className='price'>
                    <p>A sólo</p>
                    <h1>${deliveryServiceParams?.price}</h1>
                </div>
            </div>
            <div className="img">
                <img src={imgAntigeno} alt="Test de antígenos"/>
            </div>
            <div className="button">
                <button className="slide__btn">Comprá tu hisopado <FaChevronRight /></button>
            </div>
        </div>
    )
}

export default AntigenoDelivery