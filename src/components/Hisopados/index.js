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
                <div className="hisopado__container">
                    <div className="hisopado__btnsContainer">
                        <BuyHisopado />
                        <button className="hisopados-type-btn" onClick={() => history.push('/hisopado/sede')}>Test de Abbott</button>
                    </div>
                </div>
            </section>
        </>
    )
}

export default HisopadoType