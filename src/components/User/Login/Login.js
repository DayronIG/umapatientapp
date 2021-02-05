import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../../styles/login/login.scss';
import LoginIllustation from '../../../assets/illustrations/Login-Illustration.png';
import Logo from '../../../assets/logo.png';
import Google from '../../../assets/logos/google.png';
import Microsoft from '../../../assets/logos/microsoft.png';
import Apple from '../../../assets/logos/ios.png';
import Mobile from '../../../assets/logos/mobile.png';

const Login = () =>  {
    const [inputClicked, setInputClicked] = useState(false);

    return (
       <section className='login'>
           <img className='login__logo' src={Logo} alt='Logo de Uma Health'/>
           <section className='login__titleIllustration'>
                <img className='login__titleIllustration--illustration' src={LoginIllustation} alt='Ilustracion de médicos'/>
                <h1 className='login__titleIllustration--title'>ÜMA, tu portal digital de salud</h1>
           </section>
           <section className='login__buttonGroup'>
               <button className='login__button'><img src={Google} alt='Google logo'/></button>
               <button className='login__button'><img src={Microsoft} alt='Microsoft logo'/></button>
               <button className='login__button '><img src={Apple} alt='Apple logo'/></button>
               <button className='login__button'><img src={Mobile} alt='Mobile image'/></button>
           </section>
           <div className='login__lineSeparator'>
               <div className='login__lineSeparator--line'></div>
               <div>o</div>
               <div className='login__lineSeparator--line'></div>
           </div>
           <form className='login__form'>
               <label className={inputClicked ? 'login__form--label up' : 'login__form--label'}>
                   Ingresa tu mail
                </label>
                <input onClick={() => setInputClicked(true)} type='email' className={inputClicked ? 'login__form--input clicked' : 'login__form--input'} />
                <label className={inputClicked ? 'login__form--label-contraseña up ' : 'login__form--label-contraseña'}>
                    Ingresa tu contraseña
                </label>
                <input onClick={() => setInputClicked(true)} type='password' className={inputClicked ? 'login__form--input clicked' : 'login__form--input'} />
           </form>
           <section className='login__needHelp'>
                <aside className='login__needHelp__activeSession'>
                    <input className='check' type='checkbox'/>
                    <p className='text'>Mantener sesión iniciada</p>
                </aside>
                <button className='login__needHelp--btn'>Necesito ayuda</button>
           </section>
           <section className='login__actions'>
               <button className='login__actions--logInBtn'>Ingresar</button>
               <div className='login__actions__Registrer'>
                   <p className='text'>¿Eres nuevo en UMA?</p>
                    <a href='#' className='link'>Registrarme</a>
               </div>
           </section>
       </section>
    )
}

export default Login;
