import React, { useEffect } from 'react'
import { GenericHeader } from '../GeneralComponents/Headers'
import { useSelector, useDispatch } from 'react-redux'
import BuyHisopado from '../DeliveryService/BuyButton'
import { useHistory } from 'react-router-dom'
import DBConnection, { firebaseInitializeApp } from '../../config/DBConnection'

const HisopadoType = () => {
    const history = useHistory()
    const dispatch = useDispatch()
    const db = DBConnection.firestore(firebaseInitializeApp)
    const { fullname } = useSelector(state => state.user)

    useEffect(() => {
        try {
            db.collection('parametros/userapp/analysis').get()
                .then(docs => {
                    docs.forEach(doc => {
                        if(doc.id === 'abbott') {
                            dispatch({ type: 'SET_PARAMS_IN_PERSON_SERVICE', payload: doc.data() })
                        }
                    })
                })
                .catch(e => console.error(e))
        } catch (e) {
            console.error(e)
        }
    }, [])

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