import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { GenericHeader } from '../GeneralComponents/Headers';
import { useLocation, Link } from 'react-router-dom';
import '../../styles/payments/PaymentStatus.scss';
import crossIcon from '../../../src/assets/img/hisopados_cross.svg';
import payedIcon from '../../../src/assets/img/hisopados_payment.svg';
import queryString from 'query-string';
import { FaClock } from 'react-icons/fa'
import axios from 'axios'
import { analysis } from '../../config/endpoints'

const PaymentStatus = () => {
    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();
	const { currentUser } = useSelector((state) => state.userActive);
    const { mercadoPago, doc_id } = useSelector((state) => state.payments);
    const { paid, dependant, product, method, amount, payment_id } = queryString.parse(location.search);
    const [message, setMessage] = useState({
        status: '',
        header: '',
        icon: '',
        title: '',
        paragraphs: [],
        button: '',
    })

    useEffect(() => {
        if(!mercadoPago) {
            setMessage({
                status: '',
                header: 'Falta de pago',
                icon: crossIcon,
                title: 'Debes realizar un pago para obtener el servicio',
                paragraphs: ['El link que utilizaste ya caducó.'],
                button: 'Ir al inicio',
            })
        } else {
            switch (paid) {
                case 'rejected':
                    setMessage({
                        status: 'rejected',
                        header: 'Pago Rechazado',
                        icon: crossIcon,
                        title: '¡Lo sentimos!',
                        paragraphs: ['Ha ocurrido un error y el pago fue rechazado por MercadoPago.', 'No te preocupes, no hemos cobrado ningún monto. Por favor, intenta nuevamente.'],
                        button: 'Intentar de nuevo',
                    })
                break;
                case 'pending':
                    setMessage({
                        status: 'pending',
                        header: 'Pago Pendiente',
                        icon: <FaClock style={{ color: '#ff9933' }} />,
                        title: 'El pago esta siendo procesado',
                        paragraphs: product !== 'pcr_express' ? ['Cuando el pago sea confirmado te enviaremos una notificación con un link para continuar con el proceso de la consulta medica.'] : ['Cuando el pago sea confirmado te enviaremos una notificación para que puedas continuar'],
                        button: 'Ir al inicio',
                    })
                break;
                case 'true':
                    setMessage({
                        status: 'true',
                        header: 'Pago Confirmado',
                        icon: payedIcon,
                        title: '¡Hemos recibo el pago!',
                        paragraphs: product !== 'pcr_express' ? ['Toca en "Continuar" para seguir con el proceso de la consulta medica.'] : ['Ya puedes acercarte a cualquier punto de testeo para completar el proceso'],
                        button: 'Continuar',
                    })
                break;
                default:
                    break;
            }
        }
    }, [mercadoPago, paid])
    
    const handleClick = () => {
        window.gtag('event', `${product}_payment_${paid === 'true' ? 'success' : paid }`)
        window.gtag('event', `${product}_payment_method`, {
            'method': method,
            'status': `${paid === 'true' ? 'success' : paid }`
        })

        if(paid === 'rejected') {
            history.push(`/payments/checkout/${currentUser.uid}`)
        }   
        if(paid === 'true') {
            window.gtag('event', `${product}_payment_success`)
            window.gtag('event', `${product}_payment_method`, {
                'method': method,
                'status': 'success'
            })
            window.gtag('event', 'earn_virtual_currency', {
                'virtual_currency_name': 'uma_creditos',
                'value': amount
            })
            history.push(`/onlinedoctor/reason/${currentUser.uid}?dependant=${dependant}?paid=true`)
            
            if (product !== 'pcr_express') {
                window.gtag('event', 'earn_virtual_currency', {
                    'virtual_currency_name': 'uma_creditos',
                    'value': amount
                })
                history.push(`/onlinedoctor/reason/${currentUser.uid}?dependant=${dependant}?paid=true`)
            } else if (product === 'pcr_express') {
                history.push('/')
            }
        }
        if(paid === 'pending') {
            history.push('/')
        }
    }

    useEffect(() => {
        const paymentDataLocal = JSON.parse(localStorage.getItem('paymentData'))
        if (paymentDataLocal) {
            dispatch({
                type: 'SET_PAYMENT',
                payload: paymentDataLocal
              })
        } 
        return (()=> {
            if (product === 'guardia'){
                dispatch({ 
                    type: 'SET_PAYMENT',
                    payload: {
                        id: payment_id,
                        mercadoPago: false,
                        price: amount
                    }
                })
                localStorage.setItem('paymentData', JSON.stringify({
                    mercadoPago: false,
                    id: payment_id,
                    price: amount
                }));
            } else {
                dispatch({ type: 'RESET_PAYMENT' })
                localStorage.removeItem('paymentData')
            }
        })
    },[]);

    return (
        <>
            <div className='rejected-payment'>
                <GenericHeader>{message.header}</GenericHeader>
                <div className='rejected-icon'>
                    {
                        paid === 'pending' ?
                        message.icon :
                        <img src={message.icon} alt='crossIcon' />
                    }
                </div>
                <div className='rejected-payment-body'>
                    <h3 
                        className={`rejected-payment-body-title-${!message.status ? 'rejected' : message.status === 'true' ? 'confirmed' : message.status}`}
                    >
                        {message.title}
                    </h3>
                    <div className='rejected-payment-body-text-container'>
                        {
                            message.paragraphs.map((p, index) => (
                                <p key={index} className='rejected-payment-body-text'>{p}</p>
                            ))
                        }
                    </div>
                    <button className='btn btn-blue-lg mb-5' onClick={handleClick}>{message.button}</button>
                </div>
            </div>
    </>
    )
}
export default PaymentStatus;

