<<<<<<< HEAD
import React, {useState} from 'react';
=======
import React, { useState } from 'react';
>>>>>>> 8980a8b1bd79d0de5d3e8db39068fc2a0e6eb48a
import LoginIllustation from '../../../assets/illustrations/Login-Illustration.png';
import { GenericInputs, GenericButton, LoginButtons, TextAndLink } from './GenericComponents';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Firebase from 'firebase/app';
import Logo from '../../../assets/logo.png';
import '../../../styles/user/login.scss';

const Login = () =>  {
    const history = useHistory();
    const dispatch = useDispatch();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorData, setErrorData] = useState([]);
    const [validations, setValidations] = useState([{
        email: false,
        password: false
    }])

    const handleSignIn = async () => {
        if(validations.email && validations.password) {
            await Firebase.auth().signInWithEmailAndPassword(email, password);
            dispatch({ type: 'USER_PASSWORD', payload: '' });
        } else {
            if(!validations.email) {
                setErrorData((errorData) =>[...errorData,'Email'])
            }
            if(!validations.password) {
                setErrorData((errorData) =>[...errorData,'Contraseña'])
            }
        }
    }

    const handleInputsValidations = (e) => {
        if(e.target.name === 'email') {
            let validEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(e.target.value)
            if(validEmail) { 
                setEmail(e.target.value)
                setValidations({ ...validations, email: true })
            } else {
                setValidations({ ...validations, email: false })
            }
        } else if(e.target.name === 'pass') {
            let validPass = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(e.target.value)
            if (validPass) {
                setPassword(e.target.value)
                setValidations({ ...validations, password: true })
            } else {
                setPassword(e.target.value)
                setValidations({ ...validations, password: false })
            }
        }
    }

    return (
       <section className='login'>
           <img className='login__logo' src={Logo} alt='Logo de Uma Health'/>
           <section className='login__titleIllustration'>
                <img className='login__titleIllustration--illustration' src={LoginIllustation} alt='Ilustracion de médicos'/>
                <h1 className='login__titleIllustration--title'>ÜMA, tu portal digital de salud</h1>
           </section>
           <LoginButtons circleBtn />
            <div className='login__lineSeparator'>o</div>
            {errorData.length !== 0 &&
                <section className='login__invalid'>
                    <p>El mail o la contraseña son incorrectos.</p>
                    <p>Comprueba los datos ingresados o <a className='login__invalid--redirect' onClick={() => history.push('/signup')}>crea una cuenta</a></p>
                </section>
            }
            <GenericInputs label='Ingresa tu mail' type='email' name='email' validate={(e) =>handleInputsValidations(e)}/>
            <GenericInputs label='Ingresa tu contraseña' type='password' name='pass' validate={(e) =>handleInputsValidations(e)} />
           <section className='login__needHelp'>
                {/* <aside className='login__needHelp__activeSession'>
                    <input className='check' type='checkbox'/>
                    <p className='text'>Mantener sesión iniciada</p>
                </aside> */}
                <button className='login__needHelp--btn' onClick={() => history.push('/forgot')}>Necesito ayuda</button> 
           </section>
           <section className='login__actions'>
                <GenericButton color='blue' action={handleSignIn}>
                    Ingresar
                </GenericButton>
                <TextAndLink text='¿Eres nuevo en UMA?' link='Registrarme' action={() => history.push('/signup')} />
           </section>
       </section>
    )
}

export default Login;
