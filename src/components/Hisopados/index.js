import React from 'react'
import { GenericHeader } from '../GeneralComponents/Headers'
import { useSelector } from 'react-redux'
import BuyHisopado from '../DeliveryService/BuyButton'
import { useHistory } from 'react-router-dom'

const HisopadoType = () => {
    const history = useHistory()
    const { fullname } = useSelector(state => state.user)

    return (
        <>
            <GenericHeader children={fullname} />

            <section className="hisopados__type">
                <BuyHisopado />

                <div className="hisopado__container">
                    <button onClick={() => history.push('/hisopado/sede')}>Hisopado PCR</button>
                    <br/>
                    <button onClick={() => history.push('/hisopado/sede')}>Test de Abbott</button>
                </div>
            </section>
        </>
    )
}

export default HisopadoType