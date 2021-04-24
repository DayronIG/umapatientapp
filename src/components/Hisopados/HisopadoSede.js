import React, { useState } from 'react'
import { GenericHeader } from '../GeneralComponents/Headers'
import { useSelector, useDispatch } from 'react-redux'
import '../../styles/hisopado/sedes.scss'
import { useHistory } from 'react-router-dom'

const HisopadoSede = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const { fullname } = useSelector(state => state.user)
    const { currentUser } = useSelector((state) => state.userActive)
    const [selected, setSelected] = useState('Las Heras')

    const payHisopado = () => {
        dispatch({
            type: 'SET_PAYMENT',
            payload: {
                product: 'hisopados',
                quantity: 1,
                title: 'Test de abbott',
                uid: currentUser.uid,
                service: 'GUARDIA',
                price: '150',
                mercadoPago: true,
            }
        })
        localStorage.setItem('paymentData', JSON.stringify({
            product: 'hisopados',
            quantity: 1,
            title: 'Test de abbott',
            uid: currentUser.uid,
            service: 'GUARDIA',
            price: '150',
            mercadoPago: true
        }));
        history.push(`/payments/checkout/${currentUser.uid}`)
    }

    return (
        <>
            <GenericHeader children={fullname} />

            <section className="sedes__container">
                <h2>Elegir consultorio</h2>

                <p>Todos los consultorios atienden de 8 a 20hs.</p>

                <label onClick={() => setSelected('Las Heras')} className={selected === 'Las Heras' ? 'selected' : ''}>
                    <input type="radio" name="sede" value="Las Heras" checked/>
                    <div>
                        <h3>Las Heras</h3>
                        <p>Av. General Las Heras 3038</p>
                    </div>
                </label>
                <label onClick={() => setSelected('Olivos')} className={selected === 'Olivos' ? 'selected' : ''}>
                    <input type="radio" name="sede" value="Olivos"/>
                    <div>
                        <h3>Olivos</h3>
                        <p>Av. Maipu 3625</p>
                    </div>
                </label>
                <label onClick={() => setSelected('Lomas')} className={selected === 'Lomas' ? 'selected' : ''}>
                    <input type="radio" name="sede" value="Lomas"/>
                    <div>
                        <h3>Lomas</h3>
                        <p>Leandro N. Alen 498</p>
                    </div>
                </label>

                <button onClick={payHisopado}>Continuar</button>
            </section>
        </>
    )
}

export default HisopadoSede