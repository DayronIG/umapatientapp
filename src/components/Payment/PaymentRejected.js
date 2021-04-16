import React, { useEffect } from 'react'
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import { GenericHeader } from '../GeneralComponents/Headers';
import { useLocation, Link } from 'react-router-dom';
import '../../styles/payments/PaymentRejected.scss';
import crossIcon from '../../../src/assets/img/hisopados_cross.svg';
import queryString from 'query-string';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';

const PaymentRejected = () => {
    const history = useHistory();
    const location = useLocation();
	const { currentUser } = useSelector((state) => state.userActive);
    const { paid } = queryString.parse(location.search);

    const handleClick = () => {
        if(paid === 'rejected') return history.push(`/payments/checkout/${currentUser.uid}`)   
        return history.push('/')
    }

    return (
        <>
        {paid === 'rejected' ? (
            <div className='rejected-payment'>
                <GenericHeader>Pago Rechazado</GenericHeader>
                <div className='rejected-icon'>
                    <img src={crossIcon} alt='crossIcon'/>
                </div>
                <div className='rejected-payment-body'>
                    <h3 className='rejected-payment-body-title'>¡Lo sentimos!</h3>
                    <div className='rejected-payemnt-body-text-container'>
                        <p className='rejected-payment-body-text'>Ha ocurrido un error y el pago fue rechazado por MercadoPago.</p>
                        <p className='rejected-payment-body-text'>No te preocupes, no hemos cobrado ningún monto. Por favor, intenta nuevamente.</p>
                    </div>
                    <button className='btn btn-blue-lg mb-5' onClick={handleClick}>Intentar de nuevo</button>
                </div>
            </div>
        ) : (
            <div className='rejected-payment'>
                <GenericHeader>Pago Pendiente</GenericHeader>
                <div className='rejected-icon'>
                    <FontAwesomeIcon icon={faClock} style={{color: '#ff9933'}}/>
                </div>
                <div className='rejected-payment-body'>
                    <h3 className='rejected-payment-body-title-pending'>El pago esta siendo procesado</h3>
                    <div className='rejected-payemnt-body-text-container'>
                        <p className='rejected-payment-body-text'>Algun texto que se les ocurra poner en esta parte.</p>
                        <p className='rejected-payment-body-text'>Cuando el pago sea confirmado te avisaremos.</p>
                    </div>
                    <Link to={'/'} className='rejected-payment-body-link'>Ir al inicio</Link>
                </div>
            </div>
        )}
    </>
    )
}
export default PaymentRejected;

