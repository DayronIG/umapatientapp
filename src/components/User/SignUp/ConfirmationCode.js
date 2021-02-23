import React, { useState } from 'react';
import Confirm from '../../../assets/illustrations/ConfirmMail.png';
import Logo from '../../../assets/logo.png';
import { Stepper, TextAndLink } from '../Login/GenericComponents';

const ConfirmationCode = () => {
    const [codeConfirm, setCodeConfirm] = useState('Mail')
    // Mail or number switch

    return (
        <section className='signUp'>
            <img className='signUp__logo' src={Logo}/>
            <section className='signUp__content'>
                <Stepper complete={4}/>
                <img src={Confirm} className='signUp__content--illustration' alt='Mailbox'/>
                <article className='signUp__content__mainText'>
                    <h1 className='title'>Ingresa el código de verificación</h1>
                    { codeConfirm == 'Mail' &&
                    <>
                        <p className='subtitle'>Para finalizar el registro, ingresa el código de 6 dígitos que te hemos enviado a tu mail.</p> 
                        <p className='subtitle'>PD: ¡No olvides revisar el Spam!</p>
                    </>
                    }
                    { codeConfirm == 'Number' && 
                    <>
                        <p className='subtitle'>Para finalizar el registro, ingresa el código de 6 dígitos que te hemos enviado al +5433682199.</p>
                        <a href='#'>Modificar teléfono</a>
                    </>
                    }
                </article>
                <form className='signUp__content__formGroup'>
                        <input className='input-number' type="text" inputMode="numeric" maxLength='1' required />
                        <input className='input-number' type="text" inputMode="numeric" maxLength='1' required />
                        <input className='input-number' type="text" inputMode="numeric" maxLength='1' required />
                        <input className='input-number' type="text" inputMode="numeric" maxLength='1' required /> 
                        <input className='input-number' type="text" inputMode="numeric" maxLength='1' required />
                        <input className='input-number' type="text" inputMode="numeric" maxLength='1' required />
                </form>
                <TextAndLink text='¿No te llegó el código?' link='Enviar por otro medio'/>
            </section>
        </section>
    )
}

export default ConfirmationCode;
