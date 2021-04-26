import React, { useState, useEffect } from 'react'
import { GenericHeader } from '../GeneralComponents/Headers'
import { useSelector, useDispatch } from 'react-redux'
import '../../styles/hisopado/sedes.scss'
import { useHistory } from 'react-router-dom'

const HisopadoSede = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const { fullname } = useSelector(state => state.user)
    const { currentUser } = useSelector((state) => state.userActive)
    const { params } = useSelector((state) => state.inPersonService)
    const [rooms, setRooms] = useState([])
    const [selected, setSelected] = useState(null)

    useEffect(() => {
        if(params) {
            setRooms(params.consulting_rooms)
        }
    }, [params])

    const payHisopado = () => {
        if (selected) {
            dispatch({ type: 'SET_IN_PERSON_SERVICE', payload: { type: 'Test de Abbott', office: selected } })
            dispatch({ type: 'SET_CURRENT_IN_PERSON_SERVICE_USER', payload: currentUser })

            dispatch({
                type: 'SET_PAYMENT',
                payload: {
                    product: 'hisopados',
                    quantity: 1,
                    title: 'Test de abbott',
                    uid: currentUser.uid,
                    service: '',
                    price: params.price,
                    mercadoPago: true,
                }
            })
            localStorage.setItem('paymentData', JSON.stringify({
                product: 'hisopados',
                quantity: 1,
                title: 'Test de abbott',
                uid: currentUser.uid,
                service: '',
                price: params.price,
                mercadoPago: true
            }));
            history.push(`/payments/checkout/${currentUser.uid}`)
        }
    }

    return (
        <>
            <GenericHeader children={fullname} />

            <section className="sedes__container">
                <h2>Elegir consultorio</h2>

                <p>Todos los consultorios atienden de 8 a 20hs.</p>

                {
                    rooms.map(room => (
                        <label key={room.address} onClick={() => setSelected(room)} className={selected?.name === room.name ? 'selected' : ''}>
                            <input type="radio" name="sede" value={room.name} />
                            <div>
                                <h3>{room.name}</h3>
                                <p>{room.address}</p>
                            </div>
                        </label>
                    ))
                }

                <button disabled={!selected ? true : false} onClick={payHisopado}>Continuar</button>
            </section>
        </>
    )
}

export default HisopadoSede