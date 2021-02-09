import React, { useState } from 'react';
import '../../../../styles/login/forgottenPass/forgottenPass.scss';
import BackButton from '../../../GeneralComponents/Backbutton';
import { LoginButtons } from '../GenericComponents';
import ConfirmMail from '../../../../assets/illustrations/ConfirmMail.png'

const ConfirmAcc = () => {
    const [passW, setPassW] = useState(true)
    
    return (
        <section className='needHelp'>
            <BackButton/>
            <section className='needHelp__forgottenPass'>
                {passW ? null : <img src={ConfirmMail} alt='Mailbox' />}
                <h1 className='title'>{ passW ? '¿Olvidaste tu mail?' : 'Te hemos enviado un mail' }</h1>
                {/* Poner mail dinamico */}
                <p className='subtitle'>{ passW ? `El documento ingresado está asociado a este email: ${passW}` : 'Si el mail que ingresaste está registrado, te llegará un mail con un link para restablecer tu contraseña. ' }</p>
                 
                <p className='subtitle'>{ passW ? 'Si reconoces estos datos, puedes ingresar con tu mail o tu celular.' : 'PD: ¡No olvides revisar el Spam!' }</p>
                <div className='needHelp--forgottenPass-actions'>
                    {
                        passW ?
                        <>
                            <LoginButtons />
                            <p className='redirect'>O <a href='#' className='link'>registrate acá</a></p>
                        </>
                        :
                        <a href='#' className='link'>Ir a inicio</a>
                    }
                </div>
            </section> 
        </section>
    )
}

export default ConfirmAcc;
