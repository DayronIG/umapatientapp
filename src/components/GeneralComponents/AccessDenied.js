import React from 'react';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import FooterBtn from '../GeneralComponents/FooterBtn';
import '../../styles/generalcomponents/AccessDenied.scss';

const AccessDenied = (props) => {
    return (
        <>
            <div className='accessDenied'>
                <div className='accessDenied__container'>
                    <span className='accessDenied__container--icon'>
                        <FontAwesomeIcon icon={faExclamationCircle} />
                    </span>
                </div>
                <div className='accessDenied__container'>
                    <h4 className='accessDenied__container--title'>
                        No cuentas con este servicio
                    </h4>
                </div>
                <div className='accessDenied__container'>
                    <p className='accessDenied__container--text'>
                        Tu suscripción o cobertura de salud no cuenta con este servicio.
                    </p>
                </div>
            </div>
            <FooterBtn mode='single' text='Volver' callback={() => props.history.push('/')} />
        </>
    )
}
export default withRouter(AccessDenied)