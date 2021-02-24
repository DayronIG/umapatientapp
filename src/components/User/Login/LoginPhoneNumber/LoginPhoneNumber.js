import React, { useState, useEffect } from 'react';
import Logo from '../../../../assets/logo.png';
import LoginIllustration from '../../../../assets/illustrations/Login-Illustration.png';
import { GenericInputs, GenericButton, LoginButtons, TextAndLink } from '../GenericComponents';
import {node_patient} from '../../../../config/endpoints';
import {checkNum} from '../../../Utils/stringUtils';
import {useSelector} from 'react-redux';
import axios from 'axios';
import '../../../../styles/user/login.scss';

const LoginPhoneNumber = () => { //Telefono -> false, mail
    const [switchContent, setSwitchContent] = useState(false)
    const [ws, setWs] = useState('')
    const {phone} = useSelector(state => state.user)

    useEffect(() => {
        if(phone) {
            setWs(phone);
        }
    }, [phone])

    const handleCheckUserExists = () => {
        if (ws) {
            const config = { headers: { 'Content-Type': 'application/json' } }
            const validPhone = checkNum(ws)
            if (ws === "undefined" || validPhone === "NaN" || isNaN(validPhone)) {
                // history.push('/login')
            } else {
                axios.get(`${node_patient}/exists/${validPhone}`, {}, config)
                    .then((res) => {
                        console.log(res);
                        if (res.data.redirect === 'register') {
                            // history.replace(`/register/${validPhone}`)
                        } else {
                            // history.replace(`/login/${validPhone}`)
                        }
                    })
                    .catch(err => console.error('Ocurrió un error en el Login', `${err}`, 'warning'))
            }
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
                    <p>El teléfono ingresado está asociado a este email: asd****@gmail.com </p>
                    <p>Si reconoces estos datos, puedes ingresar con tu mail.</p>
                </article>
                : 
                <p>Por favor, ingresa tu número de celular</p>
                }
            </section>
            {!switchContent && <GenericInputs label='Ingresa tu número de celular' name='phone' /> }
            {switchContent ? 
            <>
                <LoginButtons/>
                <TextAndLink link='O registrate acá'/>
            </>
            :
            <>
                <section className='login__needHelp phone'>
                    <aside className='login__needHelp__activeSession'>
                        <input className='check' type='checkbox'/>
                        <p className='text'>Mantener sesión iniciada</p>
                    </aside>
                </section>
                <section className='login__actions '>
                        <GenericButton color='blue' action={handleCheckUserExists}>Ingresar</GenericButton>
                </section>
            </>
            }
        </section>
    )
}

export default LoginPhoneNumber;
