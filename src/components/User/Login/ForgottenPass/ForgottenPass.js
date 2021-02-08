import React from 'react'
import { GenericButton } from '../GenericComponents';
import { BackButton } from '../../../GeneralComponents/Headers';
import '../../../../styles/login/forgottenPass/forgottenPass.scss';

const ForgottenPass = () => {
    return (
        <div>
            <BackButton/>
            {/* customTarget por props para backbutton */}
            <section className='forgottenPass'>
                <h1 className='title'>¿Tienes problemas para ingresar?</h1>
                <div className='forgottenPass_btns'>
                    <GenericButton>Olvidé mi mail</GenericButton>
                    <GenericButton>Olvidé mi contraseña</GenericButton>
                </div>
            </section>
        </div>
    )
}

export default ForgottenPass;
