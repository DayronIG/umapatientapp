import React, { useState, useEffect } from 'react';
import Logo from '../../../../assets/logo.png';
import LoginIllustration from '../../../../assets/illustrations/Login-Illustration.png';
import { GenericInputs, GenericButton, LoginButtons, TextAndLink } from '../GenericComponents';
import {node_patient} from '../../../../config/endpoints';
import {checkNum} from '../../../Utils/stringUtils';
import {useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';
import axios from 'axios';
import db from '../../../../config/DBConnection';
import '../../../../styles/user/login.scss';

const LoginPhoneNumber = () => { //Telefono -> false, mail
    const history = useHistory();
    const [switchContent, setSwitchContent] = useState(false)
    const [ws, setWs] = useState('')
    const {phone, dni} = useSelector(state => state.user)
    const firestore = db.firestore();

    useEffect(() => {
        if(phone) {
            setWs(phone);
        }
    }, [phone])

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
                                    setSwitchContent(true);
                                } else {
                                    console.log('Te enviamos un código');
                                }
                            })
                        }
                    })
                    .catch(err => console.error('Ocurrió un error en el Login', `${err}`, 'warning'))
            } catch (e) {
                console.error(e);
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
            {!switchContent && 
                <>
                    <GenericInputs label='Ingresa tu número DNI' name='dni' />
                    <GenericInputs label='Ingresa tu número de celular' name='phone' />
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
