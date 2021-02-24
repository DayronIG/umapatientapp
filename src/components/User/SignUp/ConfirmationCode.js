import React, { useState, useRef } from 'react';
import Confirm from '../../../assets/illustrations/ConfirmMail.png';
import Logo from '../../../assets/logo.png';
import { Stepper, TextAndLink } from '../Login/GenericComponents';

const ConfirmationCode = () => {
    const [codeConfirm, setCodeConfirm] = useState('Mail')
    // Mail or number switch
    const num1 = useRef()
    const num2 = useRef()
    const num3 = useRef()
    const num4 = useRef()
    const num5 = useRef()
    const num6 = useRef()

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
                {/* onChange={(e) => nextInput(e)} */}
                        <input 
                        className='input-number' 
                        onChange={(e) => {
                        if(e.target.value.length === 1) num2.current.focus();
                        }} 
                        ref={num1} 
                        type="text" 
                        inputMode="numeric" 
                        maxLength='1' 
                        required />

                        <input 
                        className='input-number' 
                        onChange={(e) => {
                        if(e.target.value.length === 1) num3.current.focus();
                        if(e.target.value.length === 0) num1.current.focus()
                        }} 
                        ref={num2} 
                        type="text" 
                        inputMode="numeric" m
                        axLength='1' 
                        required />

                        <input className='input-number' 
                        onChange={(e) => {
                        if(e.target.value.length === 1) num4.current.focus();
                        if(e.target.value.length === 0) num2.current.focus()
                        }} 
                        ref={num3} 
                        type="text" 
                        inputMode="numeric" 
                        maxLength='1' 
                        required />

                        <input className='input-number' 
                        onChange={(e) => {
                        if(e.target.value.length === 1) num5.current.focus();
                        if(e.target.value.length === 0) num3.current.focus()
                        }} 
                        ref={num4} 
                        type="text" 
                        inputMode="numeric" 
                        maxLength='1' 
                        required />

                        <input className='input-number' 
                        onChange={(e) => {
                        if(e.target.value.length === 1) num6.current.focus();
                        if(e.target.value.length === 0) num4.current.focus()
                        }} 
                        ref={num5} 
                        type="text" 
                        inputMode="numeric" 
                        maxLength='1' 
                        required />

                        <input className='input-number' 
                        onChange={(e) => {
                        // if(e.target.value.length === 1) num4.current.focus();
                        if(e.target.value.length === 0) num5.current.focus()
                        }} 
                        ref={num6} 
                        type="text" 
                        inputMode="numeric" 
                        maxLength='1' 
                        required />
                </form>
                <TextAndLink text='¿No te llegó el código?' link='Enviar por otro medio'/>
            </section>
        </section>
    )
}

export default ConfirmationCode;
