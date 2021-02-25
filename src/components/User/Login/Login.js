import React from 'react';
import LoginIllustation from '../../../assets/illustrations/Login-Illustration.png';
import { GenericInputs, GenericButton, LoginButtons, TextAndLink } from './GenericComponents';
import { useHistory } from 'react-router-dom';
import Logo from '../../../assets/logo.png';
import '../../../styles/user/login.scss';

const Login = () =>  {
    const history = useHistory();

    return (
       <section className='login'>
           <img className='login__logo' src={Logo} alt='Logo de Uma Health'/>
           <section className='login__titleIllustration'>
                <img className='login__titleIllustration--illustration' src={LoginIllustation} alt='Ilustracion de médicos'/>
                <h1 className='login__titleIllustration--title'>ÜMA, tu portal digital de salud</h1>
           </section>
           <LoginButtons circleBtn />
            <div className='login__lineSeparator'>o</div>
            {/* email o password invalido? state ? section : null */}
            <section className='login_invalid' style={{display: 'none'}}>
                <p>El mail o la contraseña son incorrectos.</p>
                <p>Comprueba los datos ingresados o <a href='#'>crea una cuenta</a></p>
            </section>
            <GenericInputs label='Ingresa tu mail' type='email'/>
            <GenericInputs label='Ingresa tu contraseña' type='password'/>
           <section className='login__needHelp'>
                <aside className='login__needHelp__activeSession'>
                    <input className='check' type='checkbox'/>
                    <p className='text'>Mantener sesión iniciada</p>
                </aside>
                <button className='login__needHelp--btn'>Necesito ayuda</button> 
                {/* Link  */}
           </section>
           <section className='login__actions'>
                <GenericButton color='blue'>
                    Ingresar
                </GenericButton>
                <TextAndLink text='¿Eres nuevo en UMA?' link='Registrarme' action={() => history.push('/signup')} />
           </section>
       </section>
    )
}

export default Login;
