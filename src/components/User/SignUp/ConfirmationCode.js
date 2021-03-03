import React, { useState, useRef, useEffect } from 'react';
import {useSelector} from 'react-redux';
import { Stepper, TextAndLink } from '../Login/GenericComponents';
import {node_patient} from '../../../config/endpoints';
import {useHistory} from 'react-router-dom';
import db from '../../../config/DBConnection';
import Confirm from '../../../assets/illustrations/ConfirmMail.png';
import Logo from '../../../assets/logo.png';
import axios from 'axios';

const ConfirmationCode = () => {
    const history = useHistory();
    const [codeConfirm, setCodeConfirm] = useState('Mail')
    const [code, setCode] = useState({
        n1: null,
        n2: null,
        n3: null,
        n4: null,
        n5: null,
        n6: null,
    })
    const ws = useSelector(state => state.user.ws)
    // Mail or number switch
    const num1 = useRef()
    const num2 = useRef()
    const num3 = useRef()
    const num4 = useRef()
    const num5 = useRef()
    const num6 = useRef()

    const handleCheckUserCode = async () => {
        if (
            code.n1 === null 
            || code.n2 === null 
            || code.n3 === null 
            || code.n4 === null 
            || code.n5 === null 
            || code.n6 === null
            ) 
        return false;
        
        const finalCode = `${code.n1}${code.n2}${code.n3}${code.n4}${code.n5}${code.n6}`;

        try {
            const config = { headers: { 'Content-Type': 'application/json' } }
            let email, pass;
            await axios.get(`${node_patient}/validatePassword/${ws}/${finalCode}`, {}, config)
                .then((res) => {
                    if (res.data.type !== "email") {
                        email = `${ws}@${finalCode}.com`;
                        pass = finalCode
                    }
                })
            
            db.auth().signInWithEmailAndPassword(email, pass)
            .then((reg) => {
                console.log(reg);
                history.push(`/${ws}`)
            })
            .catch((err) => {
                if (err.code === 'auth/user-not-found') {
                    console.log('El código introducido no es válido o ya expiró.', '', 'warning')
                } else if (err.code === 'auth/wrong-password') {
                    console.log('El código introducido no es válido o ya expiró', '', 'warning')
                }
            })
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        if (code.n6) {
            handleCheckUserCode()
        }
    }, [code.n6])

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
                                if(e.target.value.length === 1) {
                                    setCode({ ...code, n1: e.target.value})
                                    num2.current.focus()
                                }
                            }} 
                            ref={num1} 
                            type="text" 
                            inputMode="numeric" 
                            maxLength='1' 
                            autoFocus
                            required 
                        />

                        <input 
                            className='input-number' 
                            onChange={(e) => {
                                if(e.target.value.length === 1) {
                                    setCode({ ...code, n2: e.target.value })
                                    num3.current.focus()
                                }
                                if(e.target.value.length === 0) num1.current.focus()
                            }} 
                            ref={num2} 
                            type="text" 
                            inputMode="numeric" m
                            axLength='1' 
                            required 
                        />

                        <input className='input-number' 
                            onChange={(e) => {
                                if(e.target.value.length === 1) {
                                    setCode({ ...code, n3: e.target.value })
                                    num4.current.focus()
                                }
                                if(e.target.value.length === 0) num2.current.focus()
                            }} 
                            ref={num3} 
                            type="text" 
                            inputMode="numeric" 
                            maxLength='1' 
                            required 
                        />

                        <input className='input-number' 
                            onChange={(e) => {
                                if(e.target.value.length === 1) {
                                    setCode({ ...code, n4: e.target.value })
                                    num5.current.focus()
                                }
                                if(e.target.value.length === 0) num3.current.focus()
                            }} 
                            ref={num4} 
                            type="text" 
                            inputMode="numeric" 
                            maxLength='1' 
                            required 
                        />

                        <input className='input-number' 
                            onChange={(e) => {
                                if(e.target.value.length === 1) {
                                    setCode({ ...code, n5: e.target.value })
                                    num6.current.focus()
                                }
                                if(e.target.value.length === 0) num4.current.focus()
                            }} 
                            ref={num5} 
                            type="text" 
                            inputMode="numeric" 
                            maxLength='1' 
                            required 
                        />

                        <input className='input-number' 
                            onChange={(e) => {
                                if(e.target.value.length === 1) {
                                    setCode({ ...code, n6: e.target.value })
                                }
                                if(e.target.value.length === 0) num5.current.focus()
                            }} 
                            ref={num6} 
                            type="text" 
                            inputMode="numeric" 
                            maxLength='1' 
                            required 
                        />
                </form>
                {/* <TextAndLink text='¿No te llegó el código?' link='Enviar por otro medio'/> */}
            </section>
        </section>
    )
}

export default ConfirmationCode;
