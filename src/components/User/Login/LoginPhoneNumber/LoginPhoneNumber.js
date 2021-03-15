import React, { useState, useEffect } from 'react';
import Logo from '../../../../assets/logo.png';
import LoginIllustration from '../../../../assets/illustrations/Login-Illustration.png';
import { GenericInputs, GenericButton, LoginButtons, TextAndLink } from '../GenericComponents';
import { node_patient, send_user_code} from '../../../../config/endpoints';
import {checkNum} from '../../../Utils/stringUtils';
import {useDispatch} from 'react-redux';
import {useHistory} from 'react-router-dom';
import axios from 'axios';
import '../../../../styles/user/login.scss';

const LoginPhoneNumber = () => { 
    const history = useHistory()
    const dispatch = useDispatch()
    const [switchContent, setSwitchContent] = useState(false)
    const [ws, setWs] = useState('')
    const [dni, setDni] = useState('')
    const [userEmail, setUserEmail] = useState('')
    const [email, setEmail] = useState('');
    const [showError, setShowError] = useState(false)

    const hideEmail = (email) => {
        const emailToShow = email.split('@')[0].slice(0, 4);
        const emailToHide = email.split('@')[0].slice(4).replace(/./g, '*');
        const domain = `@${email.split('@')[1]}`;

        return `${emailToShow}${emailToHide}${domain}`;
    };

    const validateDni = (e) => {
        if (e.target.value.length >= 7 && e.target.value.length <= 8) {
            setDni(e.target.value);
        }
    }

    const validateWs = (e) => {
        if (checkNum(e.target.value)) {
            setWs(checkNum(e.target.value));
            dispatch({ type: 'USER_FIRST_WS', payload: checkNum(e.target.value)})
        }
    }

    useEffect(() => {
        if(email) {
            const finalEmail = hideEmail(email);
            setUserEmail(finalEmail);
        }
    }, [email])

    const handleCheckUserExists = () => {
        if (ws && dni) {
            const config = { headers: { 'Content-Type': 'application/json' } }
            const validPhone = checkNum(ws)
            try {
                axios.get(`${node_patient}/user/${validPhone}/${dni}`, {}, config)
                .then(res => {
                    if (res?.data.length) {
                        if (res?.data[0]?.login) {
                            window.gtag('event', 'login_phone_number_already_linked')
                            setEmail(res?.data[0]?.email)
                            setSwitchContent(true);
                        } else {
                            try {
                                const data = { ws }
                                axios.post(`${send_user_code}/${ws}`, data, config)
                                    .then(() => {
                                        window.gtag('event', 'login_phone_number_send_code')
                                        history.push('/login/code')
                                    })
                                    .catch((err) => {
                                        console.error('Error al enviar el código')
                                    })
                            } catch (e) {
                                console.error(e);
                            }
                        }
                    } else {
                        window.gtag('event', 'login_phone_number_not_found')
                        history.push('/login/error');
                    }
                })
                .catch(e => console.error(e))
            } catch (e) {
                console.error(e);
            }
        }else {
            setShowError(true)
        }
    }


    return (
        <section className='login'>
            <img src={Logo} alt='UMA logo' className='login__logo'/>
            <section className='login__titleIllustration'>
                {!switchContent && <img src={LoginIllustration} alt='Ilustracion de médicos' className='login__titleIllustration--illustration' />}
                <h1 className={switchContent? 'login__titleIllustration--title mail': 'login__titleIllustration--title'}>Ingresa con tu {switchContent? 'mail' : 'teléfono'}</h1>
                {switchContent ? 
                <article>
                    <p>El teléfono ingresado está asociado a este email: {userEmail} </p>
                    <p>Si reconoces estos datos, puedes ingresar con tu mail.</p>
                </article>
                : 
                <p>Por favor, ingresa tus datos</p>
                }
            </section>
            {!switchContent && 
            <>
                {showError && 
                    <>
                        <p className='invalidField'>El número de identificación o teléfono son incorrectos. </p>
                        <p className='invalidField'>Por favor, compruebe los datos ingresados. </p>
                    </>
                }
                <GenericInputs 
                    label='Ingresa tu número de identidad' 
                    type='number' 
                    name='dni' 
                    action={(e)=>{validateDni(e); if(showError) setShowError(false)}} 
                />
                <GenericInputs 
                    label='Ingresa tu número de celular'
                    type='number' 
                    name='phone' 
                    action={(e) => {validateWs(e); if (showError) setShowError(false)}}
                />
            </> 
            }
            {switchContent ? 
                <>
                    <LoginButtons/>
                    <TextAndLink link='O registrate acá' action={() => history.push('/signup')} styles />
                </>
            :
            <section className='login__actions '>
                    <GenericButton action={handleCheckUserExists}>Ingresar</GenericButton>
            </section>
            }
        </section>
    )
}

export default LoginPhoneNumber;
