import React, { useState, useEffect } from 'react';
import BackButton  from '../../../GeneralComponents/Backbutton';
import { GenericInputs, GenericButton } from '../GenericComponents';
import {useParams, useHistory} from 'react-router-dom';
import Firebase from 'firebase/app';
import { checkNum } from '../../../Utils/stringUtils';
import { node_patient } from '../../../../config/endpoints';
import {useDispatch} from 'react-redux';
import axios from 'axios';
import '../../../../styles/user/forgottenPass/forgottenPass.scss';

const ForgottenPass = () => {
    const dispatch = useDispatch();
    const [passW, setPassW] = useState(true);
    const [email, setEmail] = useState('');
    const [dni, setDni] = useState('');
    const [ws, setWs] = useState('');
    const { type } = useParams();
    const history = useHistory();
    const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    useEffect(() => {
        if(type) {
            if(type === 'email') {
                setPassW(true);
            }
            
            if(type === 'password') {
                setPassW(false);
            }
        }
    }, [type])

    const validateEmail = (e) => {
        const isValid = isValidEmail.test(e.target.value);

        if(isValid) {
            setEmail(e.target.value);
        }
    }

    const validateDni = (e) => {
        if (e.target.value.length >= 7 && e.target.value.length <= 8) {
            setDni(e.target.value);
        }
    }

    const validateWs = (e) => {
        if (checkNum(e.target.value)) {
            setWs(checkNum(e.target.value));
        }
    }

    const hideEmail = (email) => {
        const emailToShow = email.split('@')[0].slice(0, 4);
        const emailToHide = email.split('@')[0].slice(4).replace(/./g, '*');
        const domain = `@${email.split('@')[1]}`;

        return `${emailToShow}${emailToHide}${domain}`;
    };

    const handleCheckUserMethod = () => {
        const headers = { 'Content-type': 'application/json' };
        axios.post(`${node_patient}/emailexists`, { email: email }, headers)
            .then(res => {
                switch (res?.data?.details[0]?.providerId) {
                    case 'microsoft.com':
                        history.push('/forgot/error/microsoft');
                        break;
                    case 'google.com':
                        history.push('/forgot/error/google');
                        break;
                    case 'facebook.com':
                        history.push('/forgot/error/facebook');
                        break;
                    case 'password':
                        handleResetPassword();
                        break;
                    default:
                        handleResetPassword();
                }
            })
            .catch(e => console.error(e));
    }

    const handleResetPassword = () => {
        window.gtag('event', 'forgot_password_confirm')
        try {
            Firebase.auth().sendPasswordResetEmail(email)
            .then(() => {
                history.push('/forgot/finalStep/sendEmail');
            })
        } catch (e) {
            console.error(e);
        }
    }

    const handleCheckUser = () => {
        window.gtag('event', 'forgot_email_confirm')
        const config = { headers: { 'Content-Type': 'application/json' } }
        try {
            axios.get(`${node_patient}/user/${ws}/${dni}`, {}, config)
            .then(response => {
                dispatch({ type: 'USER_FIRST_EMAIL', payload: hideEmail(response.data[0].email)});
                history.push('/forgot/finalStep/login');
            })
            .catch(e => console.error(e))
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <section className='needHelp'>
            <BackButton inlineButton customTarget={`/forgot`}/>
            <section className='needHelp__forgottenPass'>
                <h1 className='title'>{ passW ? '¿Olvidaste tu mail?' : '¿Olvidaste tu contraseña?' }</h1>
                <p className='subtitle'>
                { passW ? 
                'Por favor, ingresa tu número de documento de identidad.'
                : 
                'Por favor, ingresa tu direccion de correo electrónico. Te enviaremos un mail con un link al que debes ingresar para restablecer tu contraseña.' }
                </p>
                <p className='subtitle'>{ passW ? null : 'Asegúrate de ingresar la direccion de correo con la que te registraste en ÜMA.' }</p>
                <p className='subtitle'>{ passW ? null : 'PD: ¡No te olvides de revisar en Spam!' }</p>
            </section> 
            <div className='needHelp--forgottenPass-actions'>
                {
                    passW ?
                    <>
                        <GenericInputs 
                            label='Ingresa tu documento'
                            type='number'
                            name='dni'
                            action={validateDni}
                        />
                        <GenericInputs 
                            label='Ingresa tu número de celular'
                            type='number'
                            name='ws'
                            action={validateWs}
                        />
                        <GenericButton action={handleCheckUser} styles>
                            Continuar
                        </GenericButton>
                    </>
                    :
                    <>
                        <GenericInputs 
                            label='Ingresa tu mail' 
                            type='email' 
                            name='email' 
                            action={validateEmail}
                        />
                        <GenericButton action={handleCheckUserMethod}>
                            Enviar 
                        </GenericButton>
                    </>
                }
            </div>
        </section>
    )
}

export default ForgottenPass;
