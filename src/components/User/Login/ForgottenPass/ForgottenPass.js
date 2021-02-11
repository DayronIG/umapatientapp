import React, { useState } from 'react';
import '../../../../styles/user/forgottenPass/forgottenPass.scss';
import { BackButton } from '../../../GeneralComponents/Headers';
import { GenericInputs, GenericButton } from '../GenericComponents';

const ForgottenPass = () => {
    const [passW, setPassW] = useState(true)

    return (
        <section className='needHelp'>
            <BackButton inlineButton/>
            <section className='needHelp__forgottenPass'>
                <h1 className='title'>{ passW ? '¿Olvidaste tu mail?' : '¿Olvidaste tu contraseña?' }</h1>
                <p className='subtitle'>{ passW ? 'Por favor, ingresa tu número de documento de identidad.' : 'Por favor, ingresa tu direccion de correo electrónico. Te enviaremos un mail con un link para restablecer tu contraseña.' }</p>
                <p className='subtitle'>{ passW ? null : 'Asegúrate de ingresar la direccion de correo con la que te registraste en ÜMA.' }</p>
                <div className='needHelp--forgottenPass-actions'>
                    {
                        passW ?
                        <>
                            <GenericInputs label='Ingresa tu documento'/>
                            <GenericButton color='blue'>
                                Continuar
                            </GenericButton>
                        </>
                        :
                        <>
                            <GenericInputs label='Ingresa tu mail'/>
                            <GenericButton color='blue'>
                                Enviar Link
                            </GenericButton>
                        </>
                    }
                </div>
            </section> 
        </section>
    )
}

export default ForgottenPass;