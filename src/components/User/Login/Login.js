import React, { useState } from 'react';
import LoginIllustation from '../../../assets/illustrations/Login-Illustration.png';
import { GenericInputs, GenericButton, LoginButtons, TextAndLink } from './GenericComponents';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Firebase from 'firebase/app';
import Logo from '../../../assets/logo.png';
import '../../../styles/user/login.scss';

const Login = () =>  {
    const history = useHistory();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorData, setErrorData] = useState(false);

    const handleSignIn = async () => {
        await Firebase.auth().signInWithEmailAndPassword(email, password)
            .then(()=>setErrorData(false))
            .catch(()=>setErrorData(true))
    }

    return (
       <section className='login'>
           <img className='login__logo' src={Logo} alt='Logo de Uma Health'/>
           <section className='login__titleIllustration'>
                <img className='login__titleIllustration--illustration' src={LoginIllustation} alt='Ilustracion de médicos'/>
                <h1 className='login__titleIllustration--title'>ÜMA, tu portal digital de salud</h1>
           </section>
           <LoginButtons circleBtn />
            <div className='login__lineSeparator'>o ingresá con tu cuenta</div>
            {errorData &&
                <section className='login__invalid'>
                    <p>El mail o la contraseña son incorrectos.</p>
                    <p>Comprueba los datos ingresados o <a className='login__invalid--redirect' onClick={() => history.push('/signup')}>crea una cuenta</a></p>
                </section>
            }
            <GenericInputs 
                label='Ingresa tu mail' 
                type='email' 
                name='email' 
                action={(e) => {setEmail(e.target.value); 
                if(errorData) setErrorData(false)} }
            />
            <GenericInputs 
                label='Ingresa tu contraseña' 
                type='password' 
                name='pass' 
                action={(e) =>{setPassword(e.target.value); 
                if(errorData) setErrorData(false)}} 
            />
           <section className='login__needHelp'>
                {/* <aside className='login__needHelp__activeSession'>
                    <input className='check' type='checkbox'/>
                    <p className='text'>Mantener sesión iniciada</p>
                </aside> */}
                <button className='login__needHelp--btn' onClick={() => history.push('/forgot')}>
                    Necesito ayuda
                </button> 
           </section>
           <section className='login__actions'>
                <GenericButton action={handleSignIn}>
                    Ingresar
                </GenericButton>
                <TextAndLink text='¿Eres nuevo en ÜMA?' link='Registrarme' action={() => history.push('/signup')} />
           </section>
       </section>
    )
}

export default Login;
