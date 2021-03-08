import React, { useState, useEffect } from 'react';
import Logo from '../../../../assets/logo.png';
import LoginIllustration from '../../../../assets/illustrations/Login-Illustration.png';
import { GenericInputs, GenericButton, LoginButtons, TextAndLink } from '../GenericComponents';
import { node_patient, send_user_code} from '../../../../config/endpoints';
import {checkNum} from '../../../Utils/stringUtils';
import {useSelector, useDispatch} from 'react-redux';
import {useHistory} from 'react-router-dom';
import axios from 'axios';
import '../../../../styles/user/login.scss';

const LoginPhoneNumber = () => { 
    const history = useHistory();
    const dispatch = useDispatch();
    const [switchContent, setSwitchContent] = useState(false)
    const [ws, setWs] = useState('')
    const [dni, setDni] = useState('')
    const [userEmail, setUserEmail] = useState('');
    const { email } = useSelector(state => state.user);

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
                axios.get(`${node_patient}/exists/${validPhone}`, {}, config)
                    .then((res) => {
                        if (res.data.redirect === 'register') {
                            history.push('/login/error');
                        } else {
                            axios.get(`${node_patient}/user/${validPhone}/${dni}`, {}, config)
                            .then(res => {
                                if (res?.data[0]?.login) {
                                    dispatch({ type: 'USER_FIRST_EMAIL', payload: res?.data[0]?.email})
                                    setSwitchContent(true);
                                } else {
                                    try {
                                        const data = { ws }
                                        axios.post(`${send_user_code}/${ws}`, data, config)
                                            .then(() => {
                                                history.push('/login/code')
                                            })
                                            .catch((err) => {
                                                console.log('Error al enviar el código', '', 'warning')
                                            })
                                    } catch (e) {
                                        console.error(e);
                                    }
                                    console.log('Te enviamos un código');
                                }
                            })
                        }
                    })
                    .catch(err => console.error('Ocurrió un error en el Login', `${err}`, 'warning'))
            } catch (e) {
                console.error(e);
            }
        }else {
            console.error('Ocurrio un error');
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
                <p>Por favor, ingresa tu número de celular</p>
                }
            </section>
            {!switchContent && 
                <>
                <GenericInputs label='Ingresa tu número DNI' name='dni' action={validateDni} />
                <GenericInputs label='Ingresa tu número de celular' name='phone' action={validateWs} />
                </> 
            }
            {switchContent ? 
            <>
                <LoginButtons/>
                <TextAndLink link='O registrate acá' action={() => history.push('/')} />
            </>
            :
            <section className='login__actions '>
                    <GenericButton color='blue' action={handleCheckUserExists}>Ingresar</GenericButton>
            </section>
            }
        </section>
    )
}

export default LoginPhoneNumber;
