import React, { useState, useEffect } from 'react';
import '../../../../styles/user/signUp/signUp.scss';
import Logo from '../../../../assets/logo.png';
import { ConditionButtons, LoginButtons, GenericButton } from '../GenericComponents';
import showPass from '../../../../assets/icons/showpassword.png';
import eyeOpenPass from '../../../../assets/icons/eyeopenpass.png';
import {useParams} from 'react-router-dom';

const WelcomeAgain = () => {
    const [vincular, setVincular] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const {method} = useParams();

    useEffect(() => {
        if(method) {
            setVincular(false);
        }
    }, [method])

    return (
        <section className='login'>
            <img src={Logo} alt='Logo UMA' className='login__logo' />
            <section className='login__titleAndSub'>
                <h1 className='title'>¡Te damos la bienvenida nuevamente!</h1>
                <p className='subtitle'>Antes de ingresar, necesitamos que vincules una cuenta de email.</p>
                <p className='subtitle'>Esto te servirá para recuperar tu cuenta o contraseña en caso que las olvides.</p>
            </section>
            {vincular ? 
            <LoginButtons vincular/>
            :
            <section className='login__mobile'> 
                {/* teléfono */}
                <form className='login__mobile__form'>
                    <label className='login__mobile__form--label'>Mail</label>
                    <input type='mail' className='login__mobile__form--input' placeholder='ejemplo@mail.com'/>
                    <label className='login__mobile__form--label'>Contraseña</label>
                    <input type={showPassword ? 'text' : 'password'} className='login__mobile__form--input' placeholder='password123'/>
                    <img src={showPassword ? eyeOpenPass : showPass } onClick={()=> setShowPassword(!showPassword)} className='login__mobile__form--img' alt='Eye closed'/>
                    {/* <img src={showPassword ? eyeOpenPass : showPass } className='login__mobile__form--img-confirm' alt='Eye closed'/> */}
                    <ConditionButtons/>
                    <label className='login__mobile__form--label'>Confirmar contraseña</label>
                    <input type='password' className='login__mobile__form--input' placeholder='Contraseña'/>
                </form>
                <GenericButton color='blue'>Confirmar datos</GenericButton>
            </section>
            }
        </section>
    )
}

export default WelcomeAgain;
