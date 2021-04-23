import React, { useEffect } from 'react'
import { useHistory } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { GenericHeader } from '../GeneralComponents/Headers';
import { useLocation, Link } from 'react-router-dom';
import '../../styles/payments/PaymentStatus.scss';
import crossIcon from '../../../src/assets/img/hisopados_cross.svg';
import payedIcon from '../../../src/assets/img/hisopados_payment.svg';
import queryString from 'query-string';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';

const PaymentStatus = () => {
    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();
	const { currentUser } = useSelector((state) => state.userActive);
    const { mercadoPago } = useSelector((state) => state.payments);
    const { paid, dependant, product, method, amount } = queryString.parse(location.search);
    
    const handleClick = () => {
        if(paid === 'rejected') {
            window.gtag('event', `${product}_payment_rejected`)
            window.gtag('event', `${product}_payment_method`, {
                'method': method,
                'status': 'rejected'
            })
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
            localStorage.removeItem('paymentData')
            dispatch({ type: 'RESET_PAYMENT' })
            history.push(`/onlinedoctor/reason/${currentUser.uid}?dependant=${dependant}?paid=true`)
        }
        if(paid === 'pending') {
            window.gtag('event', `${product}_payment_pending`)
            window.gtag('event', `${product}_payment_method`, {
                'method': method,
                'status': 'pending'
            })
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
    },[]);

    return (
        <>
        {paid === 'rejected' && mercadoPago &&
            <div className='rejected-payment'>
                <GenericHeader>Pago Rechazado</GenericHeader>
                <div className='rejected-icon'>
                    <img src={crossIcon} alt='crossIcon'/>
                </div>
                <div className='rejected-payment-body'>
                    <h3 className='rejected-payment-body-title-rejected'>¡Lo sentimos!</h3>
                    <div className='rejected-payment-body-text-container'>
                        <p className='rejected-payment-body-text'>Ha ocurrido un error y el pago fue rechazado por MercadoPago.</p>
                        <p className='rejected-payment-body-text'>No te preocupes, no hemos cobrado ningún monto. Por favor, intenta nuevamente.</p>
                    </div>
                    <button className='btn btn-blue-lg mb-5' onClick={handleClick}>Intentar de nuevo</button>
                    <Link to={'/'} className='rejected-payment-body-link'>Ir al inicio</Link>
                </div>
            </div>
        }
        {paid === 'pending' && mercadoPago &&
            <div className='rejected-payment'>
                <GenericHeader>Pago Pendiente</GenericHeader>
                <div className='rejected-icon'>
                    <FontAwesomeIcon icon={faClock} style={{color: '#ff9933'}}/>
                </div>
                <div className='rejected-payment-body'>
                    <h3 className='rejected-payment-body-title-pending'>El pago esta siendo procesado</h3>
                    <div className='rejected-payment-body-text-container'>
                        <p className='rejected-payment-body-text'>Cuando el pago sea confirmado te enviaremos una notificación con un link para continuar con el proceso de la consulta medica.</p>
                    </div>
                    <Link to={'/'} className='rejected-payment-body-link' onClick={handleClick}>Ir al inicio</Link>
                </div>
            </div>
        }
        {paid === 'true' && mercadoPago &&
            <div className='rejected-payment'>
                <GenericHeader>Pago Confirmado</GenericHeader>
                <div className='rejected-icon'>
                    <img src={payedIcon} alt='payedIcon'/>
                </div>
                <div className='rejected-payment-body'>
                    <h3 className='rejected-payment-body-title-confirmed'>¡Hemos recibo el pago!</h3>
                    <div className='rejected-payment-body-text-container'>
                        {/* <p className='rejected-payment-body-text'>Algun texto que se les ocurra poner en esta parte.</p> */}
                        <p className='rejected-payment-body-text'>Toca en "Continuar" para seguir con el proceso de la consulta medica.</p>
                    </div>
                    <button className='btn btn-blue-lg mb-5' onClick={handleClick}>Continuar</button>
                </div>
            </div>
        }
        {!mercadoPago && 
            <div className='rejected-payment'>
                <GenericHeader>Falta de pago</GenericHeader>
                <div className='rejected-icon'>
                    <img src={crossIcon} alt='crossIcon'/>
                </div>
                <div className='rejected-payment-body'>
                    <h3 className='rejected-payment-body-title-rejected'>Debes realizar un pago para obtener el servicio.</h3>
                    <div className='rejected-payment-body-text-container'>
                        <p className='rejected-payment-body-text'>El link que utilizaste ya caducó.</p>
                    </div>
                    <Link to={'/'} className='rejected-payment-body-link'>Ir al inicio</Link>
                </div>
            </div>
        }
    </>
    )
}
export default PaymentStatus;

